# Designing the API

### Auth Page

![Screenshot 2024-10-30 at 2.34.32 AM.png](Images/API%20Design/Screenshot_2024-10-30_at_2.34.32_AM.png)

- Signup
    
    POST /api/v1/signup
    
    ```go
    {
      "username": "ashish",
      "password": "123random",
      "type": "admin" // or user
    }
    ```
    
    Returns Status code 200, 400,403
    
    ```go
    {
      "userId": "1"
    }
    ```
    
- Signin
    
    POST /api/v1/signin
    
    ```go
    {
      "username": "ashish",
      "password": "123random"
    }
    ```
    
    Returns 
    
    ```go
    {
       "token": "123mkadsfjaidsj90120j0dj0jkq0dwj"
    }
    ```
    
    Returns a 200/403
    

### User information page

![Screenshot 2024-10-30 at 2.45.38 AM.png](Images/API%20Design/Screenshot_2024-10-30_at_2.45.38_AM.png)

- Update metadata
    
    POST /api/v1/user/metadata
    
    ```go
    {
    	"avatarId": "123",
    }
    ```
    
    Returns 200, 400, 403
    
- Get available avatars
    
    GET /api/v1/avatars
    
    ```go
    {
      "avatars": [{
         "id": 1,
         "imageUrl": "https://image.com/avatar1.png",
         "name": "Timmy"
      }]
    }
    ```
    
- Get other users metadata (name and avatar URL)
    
    GET /api/v1/user/metadata/bulk?ids=[1, 3, 55]
    Returns
    
    ```go
    {
      "avatars": [{
        "userId": 1,
        "imageUrl": "https://image.com/cat.png"
      }, {
        "userId": 3,
        "imageUrl": "https://image.com/cat2.png"
      }, {
        "userId": 55,
        "imageUrl": "https://image.com/cat3.png"
      }]
    }
    ```
    

### Space dashboard

![Screenshot 2024-10-30 at 2.46.02 AM.png](Images/API%20Design/Screenshot_2024-10-30_at_2.46.02_AM.png)

- Create a Space
    
    ![Screenshot 2024-10-30 at 3.28.47 AM.png](Images/API%20Design/Screenshot_2024-10-30_at_3.28.47_AM.png)
    
    POST /api/v1/space
    
    ```go
    {
    	 "name": "Test"
       "dimensions": "100x200",
       "mapId": "map1"
    }
    ```
    
    Returns 200/400
    
    ```go
    {
       "spaceId": "xlapwep1"
    }
    ```
    
- Delete a space
    
    DELETE /api/v1/space/:spaceId
    
    Returns 200, 400
    
- Get my existing spaces
    
    GET /api/v1/space/all
    
    ```go
    {
      "spaces": [{
         "id": 1,
    		 "name": "Test"
    	   "dimensions": "100x200",
    	   "thumbnail": "https://google.com/cat.png"
    	}, {
    	   "id": 2,
    		 "name": "Test"
    	   "dimensions": "100x200",
    	   "thumbnail": "https://google.com/cat.png"
    	}]
    }
    ```
    

### Arena

- Get a space
    
    GET /api/v1/space/:spaceId
    
    Returns
    
    ```go
    {
       "dimensions": "100x200",
       "elements": [{
     		   id: 1,
    		   element: {
      		   "id": "chair1",
      		   "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      		   "static": false,
      		   "height": 1,
      		   "width": 1
    		   }
    		   x: 20,
    		   y: 20
    	   }, {
     		   id: 2,
    	     element: {
      		   "id": "chair2",
      		   "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      		   "static": false,
      		   "height": 1,
      		   "width": 1
    		   }
    		   x: 18,
    		   y: 20
    	   }, {
     		   id: 3,
    	     element: {
      		   "id": "table1",
      		   "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5El5F7QtBVHhSpkQMSzPSDoiQWl3Q7fRG3w&s",
      		   "static": true,
      		   "height": 1,
      		   "width": 1		   
    		   }
    		   x: 19,
    		   y: 20
    	   }
       ]
    }
    ```
    
    Returns 200/400
    
- Add an element
    
    ![Screenshot 2024-10-30 at 2.42.57 AM.png](Images/API%20Design/Screenshot_2024-10-30_at_2.42.57_AM.png)
    
    POST /api/v1/space/element
    
    ```jsx
    {
      "elementId": "chair1",
      "spaceId": "123",
      "x": 50,
      "y": 20
    }
    ```
    
    Status code 200, 400
    
- Delete an element
    
    DELETE /api/v1/space/element
    
    ```go
    {
       "id": "1"
    }
    ```
    
- See all available elements
    
    ![Screenshot 2024-10-30 at 3.29.37 AM.png](Images/API%20Design/Screenshot_2024-10-30_at_3.29.37_AM.png)
    
    GET /api/v1/elements
    
    ```go
    {
      "elements": [{
     		   id: "chair1",
    		   imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
    		   width: 20,
    		   height: 20,
    		   static: true
    	   }]
    }
    ```
    

### Admin/Map Creator endpoints

- Create an element
    
    POST /api/v1/admin/element
    
    ```go
    {
    	"imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"
    	"width": 1,
    	"height": 1,
      "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
    }
    ```
    
    Returns 
    
    ```go
    {
    	id: "id_of_the_element"
    }
    ```
    
- Update an element
    
    PUT /api/v1/admin/element/:elementId
    (Cant update dimensions once created)
    
    ```go
    {
    	"imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"	
    }
    ```
    
- Create an avatar
    
    POST /api/v1/admin/avatar
    
    ```go
    {
    	"imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
    	"name": "Timmy"
    }
    ```
    
    Returns 
    
    ```go
    {
       "avatarId": "123"
    }
    ```
    
- Create a map
    
    ![Screenshot 2024-10-30 at 2.36.16 AM.png](Images/API%20Design/Screenshot_2024-10-30_at_2.36.16_AM.png)
    
    /api/v1/admin/map
    
    ```go
    {
       "thumbnail": "https://thumbnail.com/a.png",
       "dimensions": "100x200",
       "name": "100 person interview room",
       "defaultElements": [{
    		   elementId: "chair1",
    		   x: 20,
    		   y: 20
    	   }, {
    	     elementId: "chair2",
    		   x: 18,
    		   y: 20
    	   }, {
    	     elementId: "table1",
    		   x: 19,
    		   y: 20
    	   }, {
    	     elementId: "table2",
    		   x: 19,
    		   y: 20
    	   }
       ]
    }
    ```
    
    Returns 
    
    ```go
    {
    	id: mapId
    }
    ```
    

### Auth

All authenticated endpoints should be hit with an Authorization header

```go
{
  "authorization": "Bearer token_received_after_login"
}
```

# Error

- Error List
    
    200——> Event successful response 
    
    400——> Event failed response
    
    403——> Client failed to send required data