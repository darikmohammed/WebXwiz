<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
- [💻 Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Install](#install)
  - [Usage](#usage)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [🙏 Acknowledgements](#acknowledgements)
- [📝 License](#license)

<!-- PROJECT DESCRIPTION -->

# 📖 WebXwiz <a name="about-project"></a>

> User authentication and two-factor authorization system. The development is implemented in accordance with the provided requirements, adhering to SOLID principles, using Typescript, and utilizing the Apollo GraphQL framework.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://www.apollographql.com/docs/apollo-server/">Apollo</a></li>
    <li><a href="https://graphql.org/">GraphQL</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.mongodb.com/">MongoDB</a></li>
  </ul>
</details>

### Key Features <a name="key-features"></a>

- **User Registration**: Implemented a user registration system with data stored in MongoDB
- **User Authentication**: Secure user authentication using bcrypt and JWT.
- **Two-Factor Authorization**: Implement two-factor authorization for enhanced security.
- **GraphQL API**: Created a GraphQL API with Apollo Server.
- **User Profile**: Retrieve user profile information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

### Prerequisites

- Node.js
- npm

### Setup

Clone this repository to your desired folder:

- Using SSH

```sh
git clone git@github.com:darikmohammed/WebXwiz.git
cd WebXwiz
```
- Using HTTPS

```sh
git clone https://github.com/darikmohammed/WebXwiz.git
cd WebXwiz
```

- Make sure you are in the correct branch

```sh
git checkout branch-name
```

### Install

Install project dependencies:

```sh
npm install
```

### Set up environment variables: 
Create a `.env` file in the root directory and add the following: 

```sh
MONGO_URI = "your-mongodb-atlas-uri"
SECRET_KEY = 'your-secret-key'
```
### Usage

To run the project, execute the following command:

- Run build file
```sh
npm run build
npm run start
```

- Run development 
```sh
npm run dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 👥 Authors <a name="authors"></a>

👤 **Darik Mohammed**

- GitHub: [@githubhandle](https://github.com/darikmohammed)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/darik-mohammed)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🔭 Future Features <a name="future-features"></a>

- [ ] **[Password Recovery]**: Implement a password recovery mechanism.
- [ ] **[OAuth Integration]**: Allow users to log in using OAuth providers.
- [ ] **[User Roles]**: Implement different user roles and permissions.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](../../issues/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🙏 Acknowledgments <a name="acknowledgements"></a>

> Give credit to everyone who inspired your codebase.

Special thanks to WebXwiz and Valeriia Tymchenko(HR at WebXwiz)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
