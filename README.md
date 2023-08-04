# Socket.io and nodejs server

## Generate SSL certificates

    openssl genrsa -out key.pem
    openssl req -new -key key.pem -out csr.pem
    openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
    rm csr.pem

## Create a new mysql database (if it doesn't exists already)

    sudo mysql -u root -p

    CREATE USER 'camipass'@'localhost' IDENTIFIED BY 'camipass';
    CREATE DATABASE camipass;
    GRANT ALL PRIVILEGES ON camipass.* TO 'camipass'@'localhost';
    FLUSH PRIVILEGES;

### Install dependencies

    npm install

### Run in development

    npm run dev

### Build project

    npm run build


