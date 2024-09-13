# Execution commands
npm run build
<br />
npm start
<br/><br/>
-------------------------------------------------------------

# Common  Routes:

•	URL:  POST    on    /register
<br />
Body:
{
  "name": "testuser3",
  "password": "testpassword3",
  "role": "admin",
  "mobilenumber": "3957392048",
  "gender": "Male"
}


•	URL:  POST    on    /login
<br />
Body:
{
  "name": "testuser3",
  "password": "testpassword3"
}

-----------------------------------------------------

# User Routes:

•	URL: GET   on     api/users/
<br />
Header:  Authorization: Bearer <token>
<br /><br />
•	URL: GET   on     api/users/:id
<br />
Header:  Authorization: Bearer <token>
<br /><br />
•	URL: PUT   on     api/users/:id
<br />
Header:  Authorization: Bearer <token>
<br />
Body:
{
"name": "John Doe",
"mobilenumber": "1234567890",
"gender": "Male",
"role": "regular"
}
<br /><br />
•	URL: DELETE   on     api/users/:id
<br />
Header:  Authorization: Bearer <token>
<br /><br />
•	URL: GET   on     api/users/seats/:trainId
<br />
Header:  Authorization: Bearer <token>
<br /><br />

•	URL: POST   on     api/users/book-ticket/:trainId/:seatNo
<br />
Header:  Authorization: Bearer <token>
<br />


-------------------------------------------------------------------

# Admin Routes:

•	URL:  POST     on           api/admin/add-train     
<br />
Header:  Authorization: Bearer <token>
<br />
Body:
{
  "trainName": "Express Train",
  "maxSeatsAvailable": 200,
  "startLocation": "City A",
  "endLocation": "City B"
}
