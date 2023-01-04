customTemplates = {}

customTemplates.Templates = {

{
displayName="Custom AOB",
group=0,
templateSections=
[==[
<<INFO>>
// Date:    %dateCreated%
// Target:  %processName%

<<INFO_END>>

<<ENABLE>>
aobscan%isModuleScan%(aob_%cheatName%, %moduleNameC% %searchPattern%)
alloc(newmem_%cheatName%,1024%CmoduleName%)

label(return_%cheatName%)
label(originalcode_%cheatName%)

registersymbol(aob_%cheatName%)


newmem_%cheatName%:


originalcode_%cheatName%:
%originalCodeLines%
jmp return_%cheatName%


aob_%cheatName%%aobAdjust%:
jmp newmem_%cheatName%
%db90s%

return_%cheatName%:


<<ENABLE_END>>

<<DISABLE>>
unregistersymbol(aob_%cheatName%)

dealloc(newmem_%cheatName%)
aob_%cheatName%%aobAdjust%:
db %originalBytes%




%additionalInfo%
<<DISABLE_END>>

]==]
},

}


--------------------------------------------------


function customTemplates.formCreateNotify(form)
  if form.ClassName ~= "TfrmAutoInject" then
      return
  end

  local timer = createTimer()
  timer.Interval = 100
  timer.OnTimer = function(t)
      if (form.Menu == nil) then
          return
      end
      t.destroy()
      customTemplates.addMenuEntries(form)
  end
end

function customTemplates.addMenuEntries(form)
  local m, mi, sm = form.emplate1, nil, nil -- intended typo
  local createdSubmenus = {}
  local lastMenuItemFromGroup = {}
  local smIndex = 1

  mi = createMenuItem(m)
  m.add(mi)
  mi.Caption = "-" -- separator

  for i = 1, #customTemplates.Templates do
      local submenu = customTemplates.Templates[i].submenu
      local group = customTemplates.Templates[i].group
      local groupname = (submenu or "") .. (group or "")

      if submenu ~= nil then
          if createdSubmenus[submenu] then
              sm = createdSubmenus[submenu]
          else
              sm = createMenuItem(m)
              m.add(sm)
              sm.Caption = submenu
              sm.Name = "miAlternativeAOBtemplateSubmenu" .. smIndex
              smIndex = smIndex + 1
              createdSubmenus[submenu] = sm
          end
      else
          sm = m
      end

      if lastMenuItemFromGroup[groupname] == nil then
          if sm.Count > 0 and group > 0 then
              mi = createMenuItem(m)
              sm.add(mi)
              mi.Caption = "-" -- separator
          end
          mi = createMenuItem(m)
          sm.add(mi)
          lastMenuItemFromGroup[groupname] = mi
      else
          mi = createMenuItem(m)
          sm.insert(lastMenuItemFromGroup[groupname].MenuIndex + 1, mi)
          lastMenuItemFromGroup[groupname] = mi
      end

      mi.OnClick = function(sender)
          customTemplates.generate(sender, customTemplates.Templates[i])
      end
      mi.Caption = customTemplates.Templates[i].displayName
      mi.Name = "miAlternativeAOBtemplate" .. i
  end
end

registerFormAddNotification(customTemplates.formCreateNotify)

function customTemplates.generate(sender, chosenTemplate)
  local displayName = chosenTemplate.displayName
  local cheatName = chosenTemplate.defaultSymbolName or "temp"
  local template = chosenTemplate.templateSections
  local form = sender.Owner.Owner
  local origScript = form.Assemblescreen.Lines.Text

  --gather existing names from origScript from registersymbol
  local existingNames = {}
  for existingName in origScript:gmatch("registersymbol%(%s*(.-)%s*%)") do
      existingNames[1 + #existingNames] = existingName
  end
  -- also from define
  for existingName in origScript:gmatch("define%(%s*(.-)%s*,") do
      existingNames[1 + #existingNames] = existingName
  end

  local function checkForCollides(str)
      for i, v in ipairs(existingNames) do
          if v:find(str, 1, true) ~= nil then
              return 'Name "' .. str .. '" collides with existing "' .. v .. '"'
          end
          if str:find(v, 1, true) ~= nil then
              return 'Existing "' .. v .. '" collides with name "' .. str .. '"'
          end
      end
      return nil
  end

  local selectedAddress = 0
  if form.owner.DisassemblerView then
      selectedAddress = getNameFromAddress(form.owner.DisassemblerView.SelectedAddress)
  else
      selectedAddress = getNameFromAddress(getMemoryViewForm().DisassemblerView.SelectedAddress)
  end

  selectedAddress = inputQuery(displayName, "On what address do you want the jump?", selectedAddress)
  if selectedAddress == nil then
      return
  end

  cheatName = inputQuery(displayName, "What do you want to name the symbol for the injection point?", cheatName)
  if cheatName == nil then
      return
  end

  ::setValidname:: --do not allow default name or those already existing/colliding or empty
  while cheatName:lower() == "inject" or cheatName == "" do
      cheatName = inputQuery("Caution!", "Ugly name. Change it.", cheatName) or ""
      cheatName = cheatName:gsub("%s", "") -- remove spaces
  end

  -- check if already exist or collides
  local collides = checkForCollides(cheatName)
  if collides ~= nil then
      cheatName = inputQuery("Caution!", collides .. ". Change it.", cheatName) or ""
      cheatName = cheatName:gsub("%s", "") -- remove spaces
      goto setValidname
  end

  local newScript_stringlist = createStringlist()
  local gaobisResult = generateAOBInjectionScript(newScript_stringlist, cheatName, selectedAddress)
  local newScript = newScript_stringlist.Text
  newScript_stringlist.destroy()

  if newScript:match("No Process Selected") or newScript:match("Could not find unique AOB") then
      showMessage("No process selected or could not find unique AOB!")
      return
  end

  if not gaobisResult then
      showMessage("generateAOBInjectionScript raised exception!")
      return
  end

  -- note: 'origScript' and 'newScript' will have "carriage return & line feed" at the end of each line
  --       because it is taken from TStrings object.
  --       'template' has only "line feed"

  local authorName = newScript:match("Author : (.-)\r\n")
  local processName = newScript:match("Game   : (.-)\r\n")
  local isModuleScan = newScript:match("aobscan(module)") or ""
  local searchPattern = newScript:match("aobscan.-%(.*,(.-)%).-should be unique")

  local moduleName, moduleName_comma, comma_moduleName

  if isModuleScan == "module" then
      moduleName = newScript:match("aobscan.-%(" .. cheatName .. ",(.-),")
      moduleName_comma = moduleName .. ","
      comma_moduleName = "," .. moduleName
  else
      moduleName = ""
      moduleName_comma = ""
      comma_moduleName = ""
  end

  local _originalCodeLines = newScript:match("code:..(.-)..  jmp return")
  local aobAdjust = newScript:match("code:.-" .. cheatName .. "(.-):")
  local _nopLines = newScript:match("  jmp code..(.-)..return:") or ""

  if _nopLines == "" then -- other case
      _nopLines = newScript:match("  jmp newmem..(.-)..return:") or ""
  end

  local originalBytes = newScript:match("  db (.-)\r\n")
  local additionalInfo = newScript:match("...// ORIGINAL CODE %- INJECTION POINT.*")

  local origfirstLine = (_originalCodeLines .. "\r\n"):match("(.-)\r\n")
  local bracketsRegsOffset =
      origfirstLine:match("[dq]?word ptr %[.-%]") or origfirstLine:match("byte ptr %[.-%]") or
      origfirstLine:match("%[.-%]") or
      ""
  local regsOffset = origfirstLine:match("%[(.-)%]") or ""

  local originalCodeLines = _originalCodeLines:sub(3):gsub("\r\n  ", "\r\n") -- indent less version
  local nopLines = _nopLines == "" and "" or _nopLines:sub(3):gsub("\r\n  ", "\r\n") -- indent less version
  local db90s = _nopLines == "" and "" or "db" .. (nopLines .. "\r\n"):gsub("nop\r\n", " 90")
  local CoriginalCodeLines = "//Alt: " .. _originalCodeLines:sub(3):gsub("\r\n  ", "\r\n//Alt: ") -- commented version

  local replacedInstructionsSize = 5 -- replacedInstructionsSize = jumpSize + NopCount; jumpSize is 5
  db90s:gsub(
      " 90",
      function(c)
          replacedInstructionsSize = replacedInstructionsSize + 1
      end
  ) -- number of NOPs

  --Mono & Hook Address
  local injectAddress = newScript:match("INJECTING HERE %-%-%-%-%-%-%-%-%-%-\r\n(.-):")
  local injectAddressNum = getAddress(injectAddress)
  local monoAddress = ""
  if template:find("%%monoAddress%%") then -- remove lag for templates without mono
      if LaunchMonoDataCollector ~= nil and LaunchMonoDataCollector() ~= 0 then
          monoAddress = mono_addressLookupCallback(injectAddressNum) or ""
      end
  end

  --reassembleReplacedInstructions
  local tmp = getInstructionSize(injectAddressNum)
  local reassembleReplacedInstructions = "reassemble(~)"
  while tmp < replacedInstructionsSize do
      reassembleReplacedInstructions =
          reassembleReplacedInstructions .. "\nreassemble(~+" .. string.format("%X", tmp) .. ")"
      tmp = tmp + getInstructionSize(injectAddressNum + tmp)
  end

  -- use the template
  template = template:gsub("%%cheatName%%", cheatName)
  template = template:gsub("%%authorName%%", authorName)
  template = template:gsub("%%processName%%", processName)
  template = template:gsub("%%dateCreated%%", os.date("%Y-%m-%d"))
  template = template:gsub("%%isModuleScan%%", isModuleScan)
  template = template:gsub("%%searchPattern%%", searchPattern)
  template = template:gsub("%%CmoduleName%%", comma_moduleName)
  template = template:gsub("%%moduleNameC%%", moduleName_comma)
  template = template:gsub("%%moduleName%%", moduleName)
  template = template:gsub("%%replacedInstructionsSize%%", replacedInstructionsSize)
  template = template:gsub("%%_originalCodeLines%%", _originalCodeLines)
  template = template:gsub("%%originalCodeLines%%", originalCodeLines)
  template = template:gsub("%%CoriginalCodeLines%%", CoriginalCodeLines)
  template = template:gsub("%%originalBytes%%", originalBytes)
  template = template:gsub("%%aobAdjust%%", aobAdjust)
  template = template:gsub("%%additionalInfo%%", additionalInfo)
  template = template:gsub("%%bracketsRegsOffset%%", bracketsRegsOffset)
  template = template:gsub("%%regsOffset%%", regsOffset)
  template = template:gsub("%%injectAddress%%", injectAddress)
  template = template:gsub("%%monoAddress%%", monoAddress)
  template =
      template:gsub(
      "%%reassembleReplacedInstructions%((.-)%)%%",
      function(a)
          return reassembleReplacedInstructions:gsub("~", a)
      end
  )

  if db90s ~= "" then
      template = template:gsub("%%nopLines%%", nopLines)
      template = template:gsub("%%_nopLines%%", _nopLines)
      template = template:gsub("%%db90s%%", db90s)
  else
      -- remove whole line when NOP'ing is not needed
      template = template:gsub("%%nopLines%%.-\n", "")
      template = template:gsub("%%_nopLines%%.-\n", "")
      template = template:gsub("%%db90s%%.-\n", "")
  end

  local enablePart = template:match("<<ENABLE>>.(.*).<<ENABLE_END>>")
  local disablePart = template:match("<<DISABLE>>.(.*).<<DISABLE_END>>")
  local infoPart = template:match("<<INFO>>.(.*).<<INFO_END>>")

  if origScript == "\r\n" then
      origScript = ""
  end --after manually deleting all lines, there's always one empty line

  local pos = origScript:find("%[DISABLE]")
  if pos then
      newScript =
          origScript:sub(1, pos - 1) .. "\r\n" .. enablePart .. "\r\n" .. origScript:sub(pos) .. "\r\n" .. disablePart
  else
      newScript = origScript .. "[ENABLE]\r\n" .. enablePart .. "\r\n[DISABLE]\r\n" .. disablePart
  end

  if pos == nil and infoPart ~= nil then
      newScript = infoPart .. "\r\n" .. newScript
  end

  form.Assemblescreen.Lines.Text = newScript -- update
end
