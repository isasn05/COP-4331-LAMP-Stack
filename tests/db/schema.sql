-- Test database used ONLY by GitHub Actions (and local integration runs).
-- Match the table/column names to your real database if yours differ.

CREATE TABLE IF NOT EXISTS Users (
  ID INT NOT NULL AUTO_INCREMENT,
  DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  DateLastLoggedIn DATETIME NULL,
  FirstName VARCHAR(50) NOT NULL DEFAULT '',
  LastName VARCHAR(50) NOT NULL DEFAULT '',
  Login VARCHAR(50) NOT NULL DEFAULT '',
  Password VARCHAR(50) NOT NULL DEFAULT '',
  PRIMARY KEY (ID)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Colors (
  ID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) NOT NULL DEFAULT '',
  UserID INT NOT NULL DEFAULT 0,
  PRIMARY KEY (ID)
) ENGINE = InnoDB;

-- Test user. Password is stored as MD5('testpass') because the front end
-- hashes with md5.js before sending. If yours doesn't, use 'testpass' instead.
INSERT INTO Users (FirstName, LastName, Login, Password)
VALUES ('Test', 'User', 'testuser', MD5('testpass'));

INSERT INTO Colors (Name, UserID) VALUES ('Blue', 1), ('Red', 1);
