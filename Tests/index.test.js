const axios = require('axios');
const { default: expect } = require('expect');
const { beforeAll } = require('jest-circus');
const { test } = require('picomatch');
const { describe } = require('yargs');
const backend_url = "http://localhost:3000";



describe("Authentication", () => {
  test('user is able to sign up only once ', async () => {
    const username = "Ashish" + Math.random();
    const password = "123456";
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
    const password = "123456";
    const response = await axios.post(`${backend_url}/api/v1/signup`, {
      password
    });
    expect(response.status).toBe(400);
  });
  
  test('signin succeeds if the username and password are valid', async()=>{
    const username= `ashish-${Math.random()}`;
    const password = "123456";
    await axios.post(`${backend_url}/api/v1/user/signup`, {
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
    const password = "123456";
    const response = await axios.post(`${backend_url}/api/v1/signin`, {
      username: "wrongUsername",
      password,
    });
    expect(response.status).toBe(403);
  });
});

//this is the second describe for UserInformation related endpoints --By Ashish Chaurasiya;
describe("user information endpoint  ", () => {
  let token;
  let avatarId;
  
  beforeAll(async()=>{
    const username = `ashish-${Math.random()}`
    const password ="123456"

    await axios.post(`${backend_url}/api/v1/signup`,{
      username,
      password,
      type: "admin"
    });
    const response = await axios.post(`${backend_url}/api/v1/signin`,{
      username,
      password
    });
    token = response.data.token;
    const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`, {
      "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
      "name": "test-avatar",  
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    avatarId = avatarResponse.data.avatarId;
  });
  
  test("user can't update their metadata with a wrong avatar ID",async()=>{
    const response = await axios.post(`${backend_url}/api/v1/user/metadata`,{
       avatarId: "123456789"},{
        headers:{
          Authorization:`Bearer ${token}`}
        });
    expect(response.status).toBe(400);
  });
  
  test('user can update their metadata with right avatar id',async()=>{
    const response = await axios.post(`${backend_url}/api/v1/user/metadata`, {
      avatarId
    }, {
      headers: {
        Authorization:`Bearer ${token}`
      }
    });
    expect(response.status).toBe(200);
  });
  
  test("user is not able to update metadata if the auth header is not present", async () => {
    const response = await axios.post(`${backend_url}/api/v1/user/metadata`,{
      avatarId
    })
    expect(response.status).toBe(403);
  });
});

describe("User Avatar information",()=>{
  let token;
  let avatarId;
  let userId;

  beforeAll(async()=>{
    const username = `ashish-${Math.random()}`
    const password ="123456"

   const signupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
      username,
      password,
      type: "admin"
    })
    userId = signupResponse.data.userId;

    const response = await axios.post(`${backend_url}/api/v1/signin`,{
      username,
      password
    }) 
    token = response.data.token;
    const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`, {
      "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
      "name": "test-avatar",  
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    avatarId = avatarResponse.data.avatarId;
  })

  test("Get back avatar information for a user",async()=>{
     const response = await axios.get(`${backend_url}/api/v1/user/metadata/bulk?ids=[${userId}]`, {
       headers: {
         Authorization: `Bearer ${token}`
       }
     })
     expect(response.data.avatars.length).toBe(1);
     expect(response.data.avatars[0].userId).toBeDefined();
  })

  test("Available avatar lists the recently created avatar", async () => {
    const response = await axios.get(`${backend_url}/api/v1/user/avatars`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    expect(response.data.avatars.length).toBe(1)
    const currentAvatar =  response.data.avatars.find(x=>x.id ==avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe("space information",()=>{
  let token;
  let adminId;
  let adminToken;
  // let userToken;
  let mapId;
  let userId;
  let elementId;
  let element2Id;
  
  beforeAll(async()=>{
    const username = `ashish-${Math.random()}`
    const password ="123456"

   const signupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
      username,
      password,
      type: "admin"
    })

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${backend_url}/api/v1/signin`,{
      username,
      password
    }) 
    adminToken = response.data.token;

    const userSignupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
      username: username+ "-user",
      password,
      type: "user"
    });
    
    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(`${backend_url}/api/v1/signin`,{
      username,
      password
    }) 
    userToken = userSigninResponse.data.token;
    
    // const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`, {
    //   "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
    //   "name": "test-avatar",  
    // });
    // avatarId = avatarResponse.data.avatarId;
    const element1 = await axios.post(`${backend_url}/api/v1/admin/element`, {
      "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
      "name": "test-avatar",
      "width":1,
      "height":1,
      "static": true},{
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      
    const element2 = await axios.post(`${backend_url}/api/v1/admin/element`, {
        "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
        "name": "test-avatar",
        "width":1,
        "height":1,
        "static": true},{
          headers: {
            "Authorization": `Bearer ${adminToken}`
          }
        })
        elementId = element1.data.elementId;
        element2Id = element2.data.elementId;
        const map = await axios.post(`${backend_url}/api/v1/admin/map`,{
          "thumbnail": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
          "dimensions":"100x200",
          "defaultElements":[
            {
              elementId:elementId,
              x:20,
              y:2
            },
            {
              elementId:elementId,
              x:18,
              y:20
            },
            {
              elementId:element2Id,
              x:19,
              y:20
            }
        ]
        },{
          headers: {
            "Authorization": `Bearer ${adminToken}`
          }
        });
      mapId = map.data.mapId;
  })
  
  test("User is able to create space",async()=>{
    const response = await axios.post(`${backend_url}/api/v1/space`, {
      "name": "Test",
      "dimension":"100x200",
      "mapId": mapId
    },{
      headers:{
        Authorization: `Bearer ${adminToken}`
      }
    });
    expect(response.data.spaceId).toBeDefined();
  })
  
  test("User is able to create space without map id(empty space)",async()=>{
    const response = await axios.post(`${backend_url}/api/v1/space`, {
      "name": "Test",
      "dimension":"100x200",
      // "mapId": mapId
    },{
      headers:{
        Authorization: `Bearer ${adminToken}`
      }
    });
    expect(response.data.spaceId).toBeDefined();
  })
  
  test("User is not able to create space without map id and dimensions",async()=>{
    const response = await axios.post(`${backend_url}/api/v1/space`, {
      "name": "Test",
      // "dimension":"100x200",
      // "mapId": mapId
    },{
      headers:{
        Authorization: `Bearer ${adminToken}`
      }
    });
    expect(response.status).toBe(400);
  })
  
  test("User should not be able to delete a space that doesn't exist",async()=>{
    const response = await axios.delete(
      `${backend_url}/api/v1/space/randomIdDoesntExist`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );
    expect(response.status).toBe(400);
  })
  
  test("user should be able to delete space that does exist",async()=>{
    const response = await axios.post(`${backend_url}/api/v1/space`, {
      "name": "Test",
      "dimension":"100x200",
      "mapId": mapId
    },{
      headers:{
        Authorization: `Bearer ${adminToken}`
      }
    })
    const delResponse = await axios.delete(
      `${backend_url}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );
    expect(delResponse.status).toBe(200);
  })
  
  // test("Get list of user space",async()=>{
  //   const response = await axios.post(`${backend_url}/api/v1/space`, {
  //     "name": "Test",
  //     "dimension":"100x200",
  //     "mapId": mapId
  //   },{
  //     headers:{
  //       Authorization: `Bearer ${adminToken}`
  //     }
  //   })
  //   const delResponse = await axios.delete(
  //     `${backend_url}/api/v1/space/${response.data.spaceId}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${adminToken}`
  //       }
  //     }
  //   );
  //   expect(delResponse.status).toBe(200);
  // })
  
  test("use should not be able to delete space that doesn't belong to them",async()=>{
    const response = await axios.post(`${backend_url}/api/v1/space`, {
      "name": "Test",
      "dimension":"100x200",
    },{
      headers:{
        Authorization: `Bearer ${adminToken}`
      }
    });
    // expect(response.data.spaceId).toBeDefined();

    const delResponse = await axios.delete(
      `${backend_url}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      }
    );
    expect(delResponse.status).toBe(400);
  })
  
  test("admin has no space initially",async()=>{
    const response = axios.get(`${backend_url}/api/v1/space/all`,)
    expect(response.data.spaces.length).toBe(0);
  })
  
  test("admin has no space initially",async()=>{
    const spaceCreateResponse = axios.post(`${backend_url}/api/v1/space`,{
      "name": "Test",
      "dimension":"100x200",
    },{
      headers:{
        Authorization: `Bearer ${adminToken}`
      }
    })
    // expect(spaceCreateResponse.data.spaces.length).toBe();
    const response = await axios.get(`${backend_url}/api/v1/space/all`);
    const filteredSpace = response.data.spaces.find(x=>x.id == spaceCreateResponse.data.spaceId);
    expect(filteredSpace).toBeDefined();
    // expect(filteredSpace.id).toBeDefined();
    expect(response.data.spaces.length).toBe(1);
  });
})

describe("Arena endpoints",()=>{
  let userToken;
  let adminToken;
  let adminId;
  let userId;
  let mapId;
  let elementId;
  let element2Id;
  let spaceId;

  beforeAll(async()=>{
    const username = `ashish-${Math.random()}`
    const password ="123456"

    const signupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
      username,
      password,
      type: "admin"
    })

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${backend_url}/api/v1/signin`,{
      username,
      password
    }) 
    adminToken = response.data.token;

    const userSignupResponse =  await axios.post(`${backend_url}/api/v1/user/signup`,{
      username: username+ "-user",
      password,
      type: "user"
    });
    
    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(`${backend_url}/api/v1/signin`,{
      username,
      password
    }) 
    userToken = userSigninResponse.data.token;
    
    // const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`, {
    //   "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
    //   "name": "test-avatar",  
    // });
    // avatarId = avatarResponse.data.avatarId;
    const element1 = await axios.post(`${backend_url}/api/v1/admin/element`, {
      "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
      "name": "test-avatar",
      "width":1,
      "height":1,
      "static": true},{
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
        
    const element2 = await axios.post(`${backend_url}/api/v1/admin/element`, {
        "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
        "name": "test-avatar",
        "width":1,
        "height":1,
        "static": true},{
          headers: {
            "Authorization": `Bearer ${adminToken}`
          }
        })
        elementId = element1.data.elementId;
        element2Id = element2.data.elementId;
        const map = await axios.post(`${backend_url}/api/v1/admin/map`,{
          "thumbnail": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
          "dimensions":"100x200",
          "defaultElements":[
            {
              elementId:elementId,
              x:20,
              y:2
            },
            {
              elementId:elementId,
              x:18,
              y:20
            },
            {
              elementId:element2Id,
              x:19,
              y:20
            }
        ]
        },{
          headers: {
            "Authorization": `Bearer ${adminToken}`
          }
        });
      mapId = map.data.mapId;
  })
  
  test("User is able to create arena",async()=>{
    
  })
})