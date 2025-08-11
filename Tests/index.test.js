const { WebSocket } = require('ws');
const axios2 = require('axios');
const { default: expect } = require('expect');
const { response } = require('express');
const { beforeAll } = require('jest-circus');
// const { test } = require('picomatch'); // Removed - conflicts with Jest
// const { describe } = require('yargs'); // Removed - conflicts with Jest
const { promises } = require('graceful-fs');
const backend_url = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

const axios = {
  post:async (...args)=>{
    try{
      const res = await axios2.post(...args)
        return res;
      
    }catch(err){
      return err.response
    }
  },
  get:async (...args)=>{
    try{
      const res = await axios2.get(...args)
        return res;
      
    }catch(err){
      return err.response
    }
  },
  put:async (...args)=>{
    try{
      const res = await axios2.post(...args)
        return res;
      
    }catch(err){
      return err.response
    }
  },
  delete:async (...args)=>{
    try{
      const res = await axios2.post(...args)
        return res;
      
    }catch(err){
      return err.response
    }
  }
}



describe("Authentication", () => {
  test('user is able to sign up only once ', async () => {
    const username = `ashish-${Math.random()}`;
    const password = "12345678";
    const response = await axios.post(`${backend_url}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });
    expect(response.status).toBe(200);
    const updated_response = await axios.post(`${backend_url}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });
    expect(updated_response.status).toBe(400);
  });
  
  test('Signup request fails if username is empty ', async()=>{
    const password = "12345678";
    const response = await axios.post(`${backend_url}/api/v1/signup`, {
      password
    });
    expect(response.status).toBe(400);
  });
  
  test('signin succeeds if the username and password are valid', async()=>{
    const username= `ashish-${Math.random()}`;
    const password = "12345678";
    await axios.post(`${backend_url}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });
    const response = await axios.post(`${backend_url}/api/v1/signin`,{
      username,
      password
    });
    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
  });
  
  test('signin fails if the username and password are invalid',async()=>{
    const username = `ashish-${Math.random()}`;
    const password = "12345678";
    const response = await axios.post(`${backend_url}/api/v1/signin`, {
      username: "wrongUsername",
      password,
    });
    expect(response.status).toBe(403);
  });
});


// //this is the second describe for UserInformation related endpoints --By Ashish Chaurasiya;
// describe("user information endpoint  ", () => {
//   let token;
//   let avatarId;
  
//   beforeAll(async()=>{
//     const username = `ashish-${Math.random()}`
//     const password ="123456"

//     await axios.post(`${backend_url}/api/v1/signup`,{
//       username,
//       password,
//       type: "admin"
//     });
//     const response = await axios.post(`${backend_url}/api/v1/signin`,{
//       username,
//       password
//     });
//     token = response.data.token;
//     const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`, {
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "name": "test-avatar",  
//     }, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     avatarId = avatarResponse.data.avatarId;
//   });
  
//   test("user can't update their metadata with a wrong avatar ID",async()=>{
//     const response = await axios.post(`${backend_url}/api/v1/user/metadata`,{
//        avatarId: "123456789"},{
//         headers:{
//           Authorization:`Bearer ${token}`}
//         });
//     expect(response.status).toBe(400);
//   });
  
//   test('user can update their metadata with right avatar id',async()=>{
//     const response = await axios.post(`${backend_url}/api/v1/user/metadata`, {
//       avatarId
//     }, {
//       headers: {
//         Authorization:`Bearer ${token}`
//       }
//     });
//     expect(response.status).toBe(200);
//   });
  
//   test("user is not able to update metadata if the auth header is not present", async () => {
//     const response = await axios.post(`${backend_url}/api/v1/user/metadata`,{
//       avatarId
//     })
//     expect(response.status).toBe(403);
//   });
// });


// describe("User Avatar information",()=>{
//   let token;
//   let avatarId;
//   let userId;

//   beforeAll(async()=>{
//     const username = `ashish-${Math.random()}`
//     const password ="123456"

//    const signupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
//       username,
//       password,
//       type: "admin"
//     })
//     userId = signupResponse.data.userId;

//     const response = await axios.post(`${backend_url}/api/v1/signin`,{
//       username,
//       password
//     }) 
//     token = response.data.token;
//     const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`, {
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "name": "test-avatar",  
//     }, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     avatarId = avatarResponse.data.avatarId;
//   })

//   test("Get back avatar information for a user",async()=>{
//      const response = await axios.get(`${backend_url}/api/v1/user/metadata/bulk?ids=[${userId}]`, {
//        headers: {
//          Authorization: `Bearer ${token}`
//        }
//      })
//      expect(response.data.avatars.length).toBe(1);
//      expect(response.data.avatars[0].userId).toBeDefined();
//   })

//   test("Available avatar lists the recently created avatar", async () => {
//     const response = await axios.get(`${backend_url}/api/v1/user/avatars`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     expect(response.data.avatars.length).toBe(1)
//     const currentAvatar =  response.data.avatars.find(x=>x.id ==avatarId);
//     expect(currentAvatar).toBeDefined();
//   });
// });


// describe("space information",()=>{
//   let token;
//   let adminId;
//   let adminToken;
//   // let userToken;
//   let mapId;
//   let userId;
//   let elementId;
//   let element2Id;
  
//   beforeAll(async()=>{
//     const username = `ashish-${Math.random()}`
//     const password ="123456"

//    const signupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
//       username,
//       password,
//       type: "admin"
//     })

//     adminId = signupResponse.data.userId;

//     const response = await axios.post(`${backend_url}/api/v1/signin`,{
//       username,
//       password
//     }) 
//     adminToken = response.data.token;

//     const userSignupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
//       username: username+ "-user",
//       password,
//       type: "user"
//     });
    
//     userId = userSignupResponse.data.userId;

//     const userSigninResponse = await axios.post(`${backend_url}/api/v1/signin`,{
//       username,
//       password
//     }) 
//     token = userSigninResponse.data.token;
    
//     // const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`, {
//     //   "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//     //   "name": "test-avatar",  
//     // });
//     // avatarId = avatarResponse.data.avatarId;
//     const element1Response = await axios.post(`${backend_url}/api/v1/admin/element`, {
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "name": "test-avatar",
//       "width":1,
//       "height":1,
//       "static": true},{
//         headers: {
//           "Authorization": `Bearer ${adminToken}`
//         }
//       });
      
//     const element2Response = await axios.post(`${backend_url}/api/v1/admin/element`, {
//         "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//         "name": "test-avatar",
//         "width":1,
//         "height":1,
//         "static": true},{
//           headers: {
//             "Authorization": `Bearer ${adminToken}`
//           }
//         })
//         elementId = element1Response.data.elementId;
//         element2Id = element2Response.data.elementId;
//         const mapResponse = await axios.post(`${backend_url}/api/v1/admin/map`,{
//           "thumbnail": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//           "dimensions":"100x200",
//           "defaultElements":[
//             {
//               elementId:elementId,
//               x:20,
//               y:2
//             },
//             {
//               elementId:elementId,
//               x:18,
//               y:20
//             },
//             {
//               elementId:element2Id,
//               x:19,
//               y:20
//             }
//         ]
//         },{
//           headers: {
//             "Authorization": `Bearer ${adminToken}`
//           }
//         });
//       mapId = mapResponse.data.mapId;
//   })
  
//   test("User is able to create space",async()=>{
//     const response = await axios.post(`${backend_url}/api/v1/space`, {
//       "name": "Test",
//       "dimension":"100x200",
//       "mapId": mapId
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     expect(response.data.spaceId).toBeDefined();
//   })
  
//   test("User is able to create space without map id(empty space)",async()=>{
//     const response = await axios.post(`${backend_url}/api/v1/space`, {
//       "name": "Test",
//       "dimension":"100x200",
//       // "mapId": mapId
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     expect(response.data.spaceId).toBeDefined();
//   })
  
//   test("User is not able to create space without map id and dimensions",async()=>{
//     const response = await axios.post(`${backend_url}/api/v1/space`, {
//       "name": "Test",
//       // "dimension":"100x200",
//       // "mapId": mapId
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     expect(response.status).toBe(400);
//   })
  
//   test("User should not be able to delete a space that doesn't exist",async()=>{
//     const response = await axios.delete(
//       `${backend_url}/api/v1/space/randomIdDoesntExist`,
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`
//         }
//       }
//     );
//     expect(response.status).toBe(400);
//   })
  
//   test("user should be able to delete space that does exist",async()=>{
//     const response = await axios.post(`${backend_url}/api/v1/space`, {
//       "name": "Test",
//       "dimension":"100x200",
//       "mapId": mapId
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })
//     const delResponse = await axios.delete(
//       `${backend_url}/api/v1/space/${response.data.spaceId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`
//         }
//       }
//     );
//     expect(delResponse.status).toBe(200);
//   })
  
//   // test("Get list of user space",async()=>{
//   //   const response = await axios.post(`${backend_url}/api/v1/space`, {
//   //     "name": "Test",
//   //     "dimension":"100x200",
//   //     "mapId": mapId
//   //   },{
//   //     headers:{
//   //       Authorization: `Bearer ${adminToken}`
//   //     }
//   //   })
//   //   const delResponse = await axios.delete(
//   //     `${backend_url}/api/v1/space/${response.data.spaceId}`,
//   //     {
//   //       headers: {
//   //         Authorization: `Bearer ${adminToken}`
//   //       }
//   //     }
//   //   );
//   //   expect(delResponse.status).toBe(200);
//   // })
  
//   test("use should not be able to delete space that doesn't belong to them",async()=>{
//     const response = await axios.post(`${backend_url}/api/v1/space`, {
//       "name": "Test",
//       "dimension":"100x200",
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     // expect(response.data.spaceId).toBeDefined();

//     const delResponse = await axios.delete(
//       `${backend_url}/api/v1/space/${response.data.spaceId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${adminToken}`
//         }
//       }
//     );
//     expect(delResponse.status).toBe(400);
//   })
  
//   test("admin has no space initially",async()=>{
//     const response = await axios.get(`${backend_url}/api/v1/space/all`, {
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     })
//     expect(response.data.spaces.length).toBe(0);
//   })
  
//   test("admin has no space initially",async()=>{
//     const spaceCreateResponse = await axios.post(`${backend_url}/api/v1/space`,{
//       "name": "Test",
//       "dimension":"100x200",
//     },{
//       headers:{
//         Authorization: `Bearer ${adminToken}`
//       }
//     })
//     // expect(spaceCreateResponse.data.spaces.length).toBe();
//     const response = await axios.get(`${backend_url}/api/v1/space/all`, {
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     const filteredSpace = response.data.spaces.find(x=>x.id == spaceCreateResponse.data.spaceId);
//     expect(filteredSpace).toBeDefined();
//     // expect(filteredSpace.id).toBeDefined();
//     expect(response.data.spaces.length).toBe(1);
//   });
// })


// describe("Arena endpoints",()=>{
//   let userToken;
//   let adminToken;
//   let adminId;
//   let userId;
//   let mapId;
//   let elementId;
//   let element2Id;
//   let spaceId;

//   beforeAll(async()=>{
//     const username = `ashish-${Math.random()}`
//     const password ="123456"

//     const signupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
//       username,
//       password,
//       type: "admin"
//     })

//     adminId = signupResponse.data.userId;

//     const response = await axios.post(`${backend_url}/api/v1/signin`,{
//       username,
//       password
//     }) 
//     adminToken = response.data.token;

//     const userSignupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
//       username: username+ "-user",
//       password,
//       type: "user"
//     });
    
//     userId = userSignupResponse.data.userId;

//     const userSigninResponse = await axios.post(`${backend_url}/api/v1/signin`,{
//       username: username+ "-user",
//       password
//     }) 
//     userToken = userSigninResponse.data.token;
    
//     // const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`, {
//     //   "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//     //   "name": "test-avatar",  
//     // });
//     // avatarId = avatarResponse.data.avatarId;
//     const element1Response = await axios.post(`${backend_url}/api/v1/admin/element`, {
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "name": "test-avatar",
//       "width":1,
//       "height":1,
//       "static": true},{
//         headers: {
//           "Authorization": `Bearer ${adminToken}`
//         }
//       });
        
//     const element2Response = await axios.post(`${backend_url}/api/v1/admin/element`, {
//         "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//         "name": "test-avatar",
//         "width":1,
//         "height":1,
//         "static": true},{
//           headers: {
//             "Authorization": `Bearer ${adminToken}`
//           }
//         })
//         elementId = element1Response.data.elementId;
//         element2Id = element2Response.data.elementId;
//         const mapResponse = await axios.post(`${backend_url}/api/v1/admin/map`,{
//           "thumbnail": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//           "dimensions":"100x200",
//           "defaultElements":[
//             {
//               elementId:elementId,
//               x:20,
//               y:2
//             },
//             {
//               elementId:elementId,
//               x:18,
//               y:20
//             },
//             {
//               elementId:element2Id,
//               x:19,
//               y:20
//             }
//         ]
//         },{
//           headers: {
//             "Authorization": `Bearer ${adminToken}`
//           }
//         });
//         mapId = mapResponse.data.mapId;
//         const spaceResponse = await axios.post(`${backend_url}/api/v1/space`,{
//           "name": "Test",
//           "dimensions":"100x200",
//           "mapId":mapId
//         },{
//           headers:{
//             Authorization: `Bearer ${adminToken}`
//           }
//         })
//         spaceId = spaceResponse.data.spaceId;;
        
//     // const map = await axios.post(`${backend_url}/api/v1/admin/space`,{

//     // })
//   })
//   test("incorrect spaceid returns 400",async()=>{
//     const response = await axios.get(`${backend_url}/api/v1/space/123kasdk01`,{
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     expect(response.status).toBe(400);
//   })
//   test("correct spaceid returns all the elements",async()=>{
//     const response = await axios.get(`${backend_url}/api/v1/space/${spaceId}`,{ 
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     expect(response.data.dimensions).toBe("100x200");
//     expect(response.data.elements.length).toBe(3);
//     // expect(response.dimensions).toBe("100x200");
//   })
//   test("delete endpoint is able to delete an elements",async()=>{
//     const Response = await axios.get(`${backend_url}/api/v1/space/${spaceId}`,{ 
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     await axios.delete(`${backend_url}/api/v1/space/elements`,{
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       },
//       data: {
//         spaceId:spaceId,
//         elementId:Response.data.elements[0].id
//       }
//     });
//     const newResponse = await axios.get(`${backend_url}/api/v1/space/${spaceId}`,{ 
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     expect(newResponse.data.elements.length).toBe(2);
//   })
//   test("Adding elements works as expected",async()=>{
//     const Response = await axios.get(`${backend_url}/api/v1/space/${spaceId}`,{ 
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     await axios.post(`${backend_url}/api/v1/space/elements`,{
//       "elementId": elementId,
//       "spaceId": spaceId,
//       "x": 50,
//       "y": 50
//     },{
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     const newResponse = await axios.get(`${backend_url}/api/v1/space/${spaceId}`,{ 
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     expect(newResponse.data.elements.length).toBe(3);
//   })
//   test("Adding an elements fails if the element lies outside the dimension ",async()=>{
//     const Response = await axios.get(`${backend_url}/api/v1/space/${spaceId}`,{ 
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     const response = await axios.post(`${backend_url}/api/v1/space/elements`,{
//       "elementId": elementId,
//       "spaceId": spaceId,
//       "x": 1000,
//       "y": 21000
//     },{
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     // const newResponse = await axios.get(`${backend_url}/api/v1/space/${spaceId}`);
//     expect(response.status).toBe(400);
//   })
// })


// describe("Admin endpoints",()=>{
//   let adminToken;
//   let adminId;
//   let userToken;
//   let userId;
//   let elementId;
//   let element2Id;
//   beforeAll(async()=>{
//     const username = `ashish-${Math.random()}`
//     const password ="123456"

//     const signupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
//       username,
//       password,
//       type: "admin"
//     })

//     adminId = signupResponse.data.userId;

//     const response = await axios.post(`${backend_url}/api/v1/signin`,{
//       username,
//       password
//     }) 
//     adminToken = response.data.token;

//     const userSignupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
//       username: username+ "-user",
//       password,
//       type: "user"
//     });
    
//     userId = userSignupResponse.data.userId;

//     const userSigninResponse = await axios.post(`${backend_url}/api/v1/signin`,{
//       username: username+ "-user",
//       password
//     }) 
//     userToken = userSigninResponse.data.token;
//   })
//   test("user is not able to hit admin endpoints", async()=>{
//     const elementResponse = await axios.post(`${backend_url}/api/v1/admin/element`, {
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "name": "test-avatar",
//       "width":1,
//       "height":1,
//       "static": true},{
//         headers: {
//           "Authorization": `Bearer ${userToken}`
//         }
//       });
//     expect(elementResponse.status).toBe(403);
    
//     const mapResponse = await axios.post(`${backend_url}/api/v1/admin/map`,{
//       "thumbnail": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "dimensions":"100x200",
//       "defaultElements":[]
//     },{
//       headers: {
//         "Authorization": `Bearer ${userToken}`
//       }
//     });
//     expect(mapResponse.status).toBe(403);
//     const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`,{
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "name": "test-avatar",  
//     }, {
//       headers: {
//         Authorization: `Bearer ${userToken}`
//       }
//     })
//     expect(avatarResponse.status).toBe(403);

//          const updateElementsResponse = await axios.put(`${backend_url}/api/v1/admin/element/123`,{
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",  
//     }, {
//       headers: {
//         Authorization: `Bearer ${userToken}`
//       }
//     })
//     expect(updateElementsResponse.status).toBe(403);
//   })
//   test("admin is able to hit the endpoints", async()=>{
//     const elementResponse = await axios.post(`${backend_url}/api/v1/admin/element`, {
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "name": "test-avatar",
//       "width":1,
//       "height":1,
//       "static": true},{
//         headers: {
//           "Authorization": `Bearer ${adminToken}`
//         }
//       });
//     expect(elementResponse.status).toBe(200);
    
//     const mapResponse = await axios.post(`${backend_url}/api/v1/admin/map`,{
//       "thumbnail": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "dimensions":"100x200",
//       "defaultElements":[]
//     },{
//       headers: {
//         "Authorization": `Bearer ${adminToken}`
//       }
//     });
//     expect(mapResponse.status).toBe(200);
//     const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`,{
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "name": "test-avatar",  
//     }, {
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     })
//     expect(avatarResponse.status).toBe(200);

//     const updateElementsResponse = await axios.put(`${backend_url}/api/v1/admin/element/123`,{
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",  
//     }, {
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     })
//     expect(updateElementsResponse.status).toBe(200);
//   })
//   test("Admin is able to update a the image url for an element",async()=>{
//     const elementResponse = await axios.post(`${backend_url}/api/v1/admin/element`, {
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "name": "test-avatar",
//       "width":1,
//       "height":1,
//       "static": true},{
//         headers: {
//           "Authorization": `Bearer ${adminToken}`
//         }
//       });
//     const elementId = elementResponse.data.elementId;
//     const updateElementResponse = await axios.put(`${backend_url}/api/v1/admin/element/${elementId}`,{
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",  
//     }, {
//       headers: {
//         Authorization: `Bearer ${adminToken}`
//       }
//     });
//     expect(updateElementResponse.status).toBe(200);
//   })
// })



// describe("WebSocket Test",()=>{
//   let adminToken;
//   let adminUserId;
//   let userIdToken;
//   let userId;
//   let elementId;
//   let element2Id;
//   let mapId;
//   let spaceId;
//   let ws1;
//   let ws2;
//   let ws1message= [];
//   let ws2message = [];
//   let userX;
//   let userY;
//   let adminX;
//   let adminY;

//   function waitForAndPopLatestMessage(messageArray){
//     return new Promise(r=>{
//       if(messageArray.length > 0){
//         resolve(messageArray.shift());
//       }
//       else{
//         let interval = setInterval(()=>{
//           if(messageArray.length > 0){
//             resolve(messageArray.shift());
//             clearInterval(interval);
//           }
//         },100)
//       }
//     })
//   }


//   async function setupHTTP(){
//     const adminSignupResponse = await axios.post(`${backend_url}/api/v1/signup`,{
//       username: `ashish-${Math.random()}`,
//       password:"123456",
//       role:"admin"
//     })
//     adminUserId = adminSignupResponse.data.userId;
//     const adminSigninResponse = await axios.post(`${backend_url}/api/v1/signin`,{
//       username: `ashish-${Math.random()}`,
//       password:"123456",
//       // type:"admin"
//     })
//     adminToken = adminSigninResponse.data.token;
//     const userSignupResponse = await axios.post(`${backend_url}/api/v1/signup`,{
//       username: `ashish-${Math.random()}+ -user`,
//       password:"123456",
//       role:"user"
//     })
//     userId = userSignupResponse.data.userId;
//     const userSigninResponse = await axios.post(`${backend_url}/api/v1/signin`,{
//       username: `ashish-${Math.random()} + -user`,
//       password:"123456"
//     });
//     userIdToken = userSigninResponse.data.token;
//     const element1Response = await axios.post(`${backend_url}/api/v1/admin/element`, {
//       "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//       "name": "test-avatar",
//       "width":1,
//       "height":1,
//       "static": true},{
//         headers: {
//           "Authorization": `Bearer ${adminToken}`
//         }
//       });
        
//     const element2Response = await axios.post(`${backend_url}/api/v1/admin/element`, {
//         "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//         "name": "test-avatar",
//         "width":1,
//         "height":1,
//         "static": true},{
//           headers: {
//             "Authorization": `Bearer ${adminToken}`
//           }
//         })
//         elementId = element1Response.data.elementId;
//         element2Id = element2Response.data.elementId;
//         const mapResponse = await axios.post(`${backend_url}/api/v1/admin/map`,{
//           "thumbnail": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
//           "dimensions":"100x200",
//           "defaultElements":[
//             {
//               elementId:elementId,
//               x:20,
//               y:2
//             },
//             {
//               elementId:elementId,
//               x:18,
//               y:20
//             },
//             {
//               elementId:element2Id,
//               x:19,
//               y:20
//             }
//         ]
//         },{
//           headers: {
//             "Authorization": `Bearer ${adminToken}`
//           }
//         });
//         mapId = mapResponse.data.mapId;
//         const spaceResponse = await axios.post(`${backend_url}/api/v1/space`,{
//           "name": "Test",
//           "dimensions":"100x200",
//           "mapId":mapId
//         },{
//           headers:{
//             Authorization: `Bearer ${adminToken}`
//           }
//         })
//         spaceId = spaceResponse.data.spaceId;
//   };
//   async function setupWs(){
//     ws1= new WebSocket(WS_URL);
//     ws2 = new WebSocket(WS_URL);


//     await new  promise(r=>{
//       ws1.onopen = r;
//     })

//     ws1.onmessage = (event)=>{
//       ws1message.push(JSON.parse(event.data));
//     } 

//     await new  promise(r=>{
//       ws2.onopen = r;
//     })
//     ws2.onmessage = (event)=>{
//       ws2message.push(JSON.parse(event.data));
//     }
//     ws1.send(JSON.stringify({
//       "type":"join",
//       "payload":{
//         "sapceId":spaceId,
//         "token":adminToken,
//       }
      
//     }));

//     const message1 = await waitForAndPopLatestMessage(ws1message);

//     ws2.send(JSON.stringify({
//       "type":"join",
//       "payload":{
//         "sapceId":spaceId,
//         "token":userIdToken,
//       }
      
//     }));
//   }



//   beforeAll(async()=>{
//     await setupHTTP();
//     await setupWs();
//   })
//   test("Get back ack for joining the space", async () => {
//     ws1.send(JSON.stringify({
//       "type": "join",
//       "payload": {
//         "sapceId": spaceId,
//         "token": adminToken,
//       }
//     }));
//     ws2.send(JSON.stringify({
//       "type": "join",
//       "payload": {
//         "sapceId": spaceId,
//         "token": userIdToken,
//       }
//     }));
    
//     const message2 = await waitForAndPopLatestMessage(ws2message);
//     const message3 = await waitForAndPopLatestMessage(ws1message);

//     expect(message1.type).toBe("space-joined"); 
//     expect(message2.type).toBe("space-joined"); 

//     except(message1.payload.user.length).toBe(0);
//     except(message2.payload.user.length).toBe(1);

//     except(message3.type).toBe("space-joined");

//     except(message3.payload.x).toBe(message2.payload.spawn.x);
//     except(message3.payload.y).toBe(message2.payload.spawn.y);
    
//     except(message3.payload.userId).toBe(userId)



//     // except(message3.payload.y).toBe("space-joined");
//     // expect(message1.payload.user.length+message2.payload.user.length).toBe(1); 
//     // expect(message2.type).toBe("space-joined"); 

//     adminX = message1.payload.spawn.x;
//     adminY = message1.payload.spawn.y;

//     userX = message2.payload.spawn.x;
//     userY = message2.payload.spawn.y;
//   });
//   test("User should not be able to move across the boundary of the wall", async()=>{

//     ws1.send(JSON.stringify({
//       type: "movement",
//       payload:{
//         x:20000,
//         y:20000
//       }

//     })); 
//     const message = await waitForAndPopLatestMessage(ws1message);
//     expect(message.type).toBe("movement-rejected");
//     expect(message.payload.x).toBe(adminX);
//     expect(message.payload).toBe(adminY);


//   });
//   test("User should not be able to move two blocks at the same time", async()=>{

//     ws1.send(JSON.stringify({
//       type: "movement",
//       payload:{
//         x:adminX+2,
//         y:adminY
//       }

//     })); 
//     const message = await waitForAndPopLatestMessage(ws1message);
//     expect(message.type).toBe("movement-rejected");
//     expect(message.payload.x).toBe(adminX);
//     expect(message.payload).toBe(adminY);


//   });
//   test("correct movement should be broadcasted to the other socket in the room", async()=>{

//     ws1.send(JSON.stringify({
//       type: "movement",
//       payload:{
//         x:adminX+1,
//         y:adminY,
//         admin:adminId
//       }

//     })); 
//     const message = await waitForAndPopLatestMessage(ws1message);
//     expect(message.type).toBe("movement");
//     expect(message.payload.x).toBe(adminX+1);
//     expect(message.payload).toBe(adminY);


//   });
//   test("If a user leaves, the other user receives a leave event", async()=>{

//     ws1.close();

//     const message = await waitForAndPopLatestMessage(ws1message);
//     expect(message.type).toBe("user-left");
//     expect(message.payload.userId).toBe(adminUserId);
  
//   });
// }); 



// //meow meow 