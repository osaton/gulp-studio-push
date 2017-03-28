# Crasman Studio push plugin for gulp

## What is this

Modern version of the legendary push.php. Windows users can ditch Cygwin - no PHP here, only Node.

## Installation

```bash
$ npm install gulp-studio-push --save-dev
$ echo '.studio-credentials' >> .gitignore # Add .studio-credentials to .gitignore file
```

## Ignoring unwanted files
[Ignore patterns](https://git-scm.com/docs/gitignore) can be added to `.studio-ignore` file.

#### .studio-ignore example:
```gitignore
.DS_Store
dist/img/*.gif
!dist/img/allowed.gif
```

## Examples

- Recommended method: [Git branch uploading (^1.3.0)](examples/branches/)
- [Basic multiple folders setup](examples/basic/)
