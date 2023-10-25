Basic application to work in tandem with transmission's remote access torrenting to help those wanting some organization

```json
{
  // optional
  "settings": {
    "address": "192.168.1.50", // optional
    "port": 9091, // optional
    "username": "user", // optional
    "password": "pass" // optional
  },
  "paths": {
    "/media/pi/hdd1": {
      "Root": "",
      "PS2": "/Emulators/Games/PS2"
    },
    "/docs": {
      "Class1 Lectures": "/class_1",
      "Class1 Labs": "/class_1/labs",
      "Class2": "/class_2"
    }
  }
}
```
