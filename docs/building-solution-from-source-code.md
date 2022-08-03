# Building the control from source

Build scripts located at the root of the repository will handle building the solution (including the control).

### On Windows:
- The `build.bat` script at the root of the project are used to build the project
- The `clean.bat` script will remove the node_modules, or other build related files

### On Mac or Linux:
- The `build.sh` script at the root of the project are used to build the project
- The `clean.sh` script will remove the node_modules, or other build related files

---

## Required Build Dependencies

The build scripts assume the following software is installed:

| Name | Version | Link |
|:---|:---|:---|
| dotnet | dotnet5.0 | [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download) |
| node | Latest LTS | [https://nodejs.org/en/](https://nodejs.org/en/) |