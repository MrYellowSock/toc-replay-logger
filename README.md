# API Endpoints
### POST /replay/create
Creates a new room.\
Takes in a body with users, gameMap\
Returns the created room or an error message.

```javascript
fetch('YOUR_API_ENDPOINT/replay/create', {
  method: 'POST',
  headers: {
	'Content-Type': 'application/json'
  },
  body: JSON.stringify({
	"users": [{ name: "red" }, { name: "blue" }],
	"gameMap": { name: "MAP69" }
  })
})
.then(response => response.json())
```
#### response preview
```json
{
  "users": [ { "name": "sad" }, { "name": "bad" } ],
  "gameMap": { "name": "MAP69" },
  "startedAt": "2023-09-07T13:02:42.226Z",
  "roomId": 11,
  "_id": "64f9c9f2434c737c61d006cc"
}
```

### PUT /replay/progress/:roomId
Updates the progress of a room.\
Takes in a body with progress and roomId.\
Returns a 200 status code on success or an error message.
```javascript
const i = YOUR_VALUE; // Replace with the actual value or variable name

fetch(`YOUR_API_ENDPOINT/replay/progress/${i}`, {
  method: 'PUT',
  headers: {
	'Content-Type': 'application/json'
  },
  body: JSON.stringify({
	"progress":{ "walkDistance":[70,101],"reward":[5,3,5,3,5,3,5,3,5,3] } 
  })
})
.then(response => response.json())
```

### GET /replay/progress/:roomId
Retrieves the progress of a room.\
Returns the room details or an error message if the room is not found.
```javascript
const i = YOUR_VALUE; // Replace with the actual value or variable name

fetch(`YOUR_API_ENDPOINT/replay/progress/${i}`, {
  method: 'GET',
  headers: {
	'Accept': 'application/json'
  }
})
.then(response => response.json())
```

#### response preview
```json
{
  "_id": "64f9c9f1434c737c61d006c5",
  "users": [ { "name": "red" }, { "name": "blue" } ],
  "gameMap": { "name": "MAP69" },
  "startedAt": "2023-09-07T13:02:41.867Z",
  "roomId": 4,
  "progress":{ "walkDistance":[70,101],"reward":[5,3,5,3,5,3,5,3,5,3] }  
}
```

### GET /replay/progress?limit=x&offset=y
```javascript
const limit = 2;
const offset = 4;

fetch(`YOUR_API_ENDPOINT/replay/progress?limit=${limit}&offset=${offset}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})
.then(response => response.json())
```

#### response preview
```json
[
	{
	  "_id": "64f9c9f1434c737c61d006c5",
	  "users": [ { "name": "red" }, { "name": "blue" } ],
	  "gameMap": { "name": "MAP69" },
	  "startedAt": "2023-09-07T13:02:41.867Z",
	  "roomId": 4,
	  "progress": { "walkDistance":[70,101],"reward":[5,3,5,3,5,3,5,3,5,3] }
	},
	{
	  "_id": "64f9c9f1434c737c61d006c5",
	  "users": [ { "name": "red" }, { "name": "blue" } ],
	  "gameMap": { "name": "MAP69" },
	  "startedAt": "2023-09-07T13:02:41.867Z",
	  "roomId": 5,
	  "progress": { "walkDistance":[70,101],"reward":[5,3,5,3,5,3,5,3,5,3] }
	}
]

```
