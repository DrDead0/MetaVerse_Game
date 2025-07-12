const axios = require('axios');
const { default: expect } = require('expect');
const { beforeAll } = require('jest-circus');
const { describe } = require('yargs');
const backend_url = "http://localhost:3000";
describe("Authentication", () => {
  test('user is able to sign up only once ', async () => {
    const username = "Ashish" + Math.random();
    const password = "123456";
    const response = await axios.post(`${backend_url}/api/v1/user/signup`, {
      username,
      password,
      type: "admin"
    });
    expect(response.status).toBe(200);
    const updated_response = await axios.post(`${backend_url}/api/v1/user/signup`, {
      username,
      password,
      type: "admin"
    });
    expect(updated_response.status).toBe(400);
  });
  
  test('Signup request fails if username is empty ', async()=>{
    const password = "123456";
    
    const response = await axios.post(`${backend_url}/api/v1/signin`, {
      password
    });
    expect(response.status).toBe(400);
  })
  test('signin succeeds if the username and password are valid', async()=>{
    const username= `ashish-${Math.random()}`;
    const password = "123456";
    await axios.post(`${backend_url}/api/v1/signup`, {
      username,
      password,
    });
    const response = await axios.post(`${backend_url}/api/vi/singnin`,{
      username,
      password
    });
    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
  })
  test('signin fails if the username and password are invalid',async()=>{
    const username = `ashish-${Math.random()}`;
    const password = "123456";
    const response = await axios.post(`${backend_url}/api/v1/signin`, {
      username: "wrongUsername",
      password,
    });
    expect(response.status).toBe(403);
  })
});

describe("user Information", () => {
  let token;
  beforeAll(async()=>{
    const username = `ashish-${Math.random()}`
    const password ="123456"

    await axios.post(`${backend_url}/api/v1/signup`,{
      username,
      password,
      type: "admin"
    })
    const response = await axios.post(`${backend_url}/api/v1/signin`,{
      username,
      password
    }) 
    token = response.data.token;
    const avatarResponse = await axios.post(`${backend_url}/api/v1/admin/avatar`,{
      "imageUrl": "https://ik.imagekit.io/DrDead/WhatsApp%20Image%202025-06-09%20at%2021.16.21_1b3c3be5.jpg?updatedAt=1752327414741",
      "name": "test-avatar",  
      
    })

  })
  test("user can't update their metadata with a wrong avatar ID",async()=>{
    const response = await axios.post(`${backend_url}/api/v1/user/metadata`,{
       avatarId: "123456789",
    });
    expect(response.status).toBe(400);
  })
  test('user can update their metadata with right avatar id',async()=>{

  })
  test('test3',()=>{

  })
 
}) 