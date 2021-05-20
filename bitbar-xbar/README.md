# Custom plugins for [xbar](https://github.com/matryer/xbar)

Community plugins: <https://github.com/matryer/xbar-plugins>

## Installing

- Place scripts in `Library/ApplicationSupport/xbar/plugins/`
- Make them executable: `chmod +x scriptname.py`
- (Python) Make sure to install the packages used in the script
  - e.g. `pip3 install requests`

---

## Utility

- Display current german Corona stats (fetched directly from [RKI](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html))
  - [rki.1h.py](rki.1h.py)
