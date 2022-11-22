## 👨‍💻 Prerequisite Skills to Contribute

### Contribute in Documentation

- https://zer0-2.gitbook.io/type-chef-di/ click "Edit on GitHub" and create a pull request

---

## 💥 How to Contribute

- Take a look at the existing [Issues](https://github.com/OpenZer0/type-chef-di/issues) or [create a new issue](https://github.com/OpenZer0/type-chef-di/issues/new/choose)!
- [Fork the Repo](https://github.com/OpenZer0/type-chef-di/fork). Then, create a branch for any issue that you are working on. Finally, commit your work.
- Create a **[Pull Request](https://github.com/OpenZer0/type-chef-di/compare)** (_PR_), which will be promptly reviewed and given suggestions for improvements by the community.
- Add screenshots or screen captures to your Pull Request to help us understand the effects of the changes proposed in your PR.

---

## ⭐ HOW TO MAKE A PULL REQUEST:

**1.** Start by making a Fork of the [**type-chef-di**](https://github.com/OpenZer0/type-chef-di) repository. Click on the <a href="https://github.com/OpenZer0/type-chef-di/fork"><img src="https://i.imgur.com/G4z1kEe.png" height="21" width="21"></a>Fork symbol at the top right corner.

**2.** Clone your new fork of the repository in the terminal/CLI on your computer with the following command:

```bash
git clone https://github.com/<your-github-username>/type-chef-di
```

**3.** Navigate to the newly created type-chef-di project directory:

```bash
cd type-chef-di
```

**4.** Set upstream command:

```bash
git remote add upstream https://github.com/OpenZer0/type-chef-di.git
```

**5.** Create a new branch:

```bash
git checkout -b YourBranchName
```

**6.** Sync your fork or your local repository with the origin repository:

- In your forked repository, click on "Fetch upstream"
- Click "Fetch and merge"

### Alternatively, Git CLI way to Sync forked repository with origin repository:

```bash
git fetch upstream
```

```bash
git merge upstream/main
```

### [Github Docs](https://docs.github.com/en/github/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-on-github) for Syncing

**7.** Make your changes to the source code.

**8.** Stage your changes:

⚠️ **Make sure** not to commit `package.json` or `package-lock.json` file

⚠️ **Make sure** not to run the commands `git add .` or `git add *`

> Instead, stage your changes for each file/folder
>
> By using public path it means it will add all files and folders under that folder, it is better to be specific

```bash
git add public
```

_or_

```bash
git add "<files_you_have_changed>"
```

**9.** Commit your changes:

```bash
git commit -m "<your_commit_message>"
```

**10.** Push your local commits to the remote repository:

```bash
git push origin YourBranchName
```

**11.** Create a [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)!

**12.** **Congratulations!** You've made your first contribution! 🙌🏼

**_:trophy: After this, the maintainers will review the PR and will merge it if it helps move the type-chef-di project forward. Otherwise, it will be given constructive feedback and suggestions for the changes needed to add the PR to the codebase._**

---

## Run automated tests

After making changes make sure that tests passes

**1.** run test:

```bash
npm run test
```

---

## Style Guide for Git Commit Messages :memo:

**How you can add more value to your contribution logs:**

- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Reference [Issues](https://github.com/OpenZer0/type-chef-di/issues) and [Pull Requests](https://github.com/OpenZer0/type-chef-di/pulls) liberally after the first line.

---

## 💥 Issues

In order to discuss changes, you are welcome to [open an issue](https://github.com/OpenZer0/type-chef-di/issues/new/choose) about what you would like to contribute. Enhancements are always encouraged and appreciated.

