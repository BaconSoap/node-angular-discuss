USE Discuss;

CREATE TABLE Posts (
  PostID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  BoardID INT NOT NULL,
  FOREIGN KEY(BoardID) REFERENCES Boards(BoardID)
);

CREATE TABLE Users (
  UserID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  UserDisplayName VARCHAR(50) NOT NULL DEFAULT '',
  DateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  DateDeleted TIMESTAMP,
  DeletedBy INT,
  FOREIGN KEY(DeletedBy) REFERENCES Users(UserID)
);

USE Discuss;
CREATE TABLE PostsVersions (
  PostID INT NOT NULL,
  Version INT NOT NULL,
  AuthorID INT NOT NULL,
  DateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PostTitle VARCHAR(100) NOT NULL,
  PostContent TEXT NOT NULL,
  DateDeleted TIMESTAMP,
  DeletedBy INT,
  PRIMARY KEY(PostID, Version),
  FOREIGN KEY(DeletedBy) REFERENCES Users(UserID),
  FOREIGN KEY(PostID) REFERENCES Posts(PostID),
  FOREIGN KEY(AuthorID) REFERENCES Users(UserID)
);
