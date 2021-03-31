// heavily based on nat's scratch repo

import store from './store';

const url = "http://events-spa.api.swoogity.com/api/v1";

async function api_get(path) {
  let resp = await fetch(
    url + path, {});
  let respJson = await resp.json();
  return respJson.data;
}


async function api_post(path, data) {
  let state = store.getState();
  let token = state?.session?.token;

  let opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token
    },
    body: JSON.stringify(data),
  };
  let resp = await fetch(
    url + path, opts);
  return await resp.json();
}

async function api_delete(path) {
  let state = store.getState();
  let token = state?.session?.token;

  let opts = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token
    }
  }
  let resp = await fetch(
    url + path, opts);
  return await resp.text();
}

async function api_update(path, data) {
  let state = store.getState();
  let token = state?.session?.token;
  
  let opts = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token
    },
    body: JSON.stringify(data)
  }
  let resp = await fetch(
    url + path, opts);
  return await resp.json();
}

export function fetch_users() {
  api_get("/users").then((data) => {
    let action = {
      type: 'users/set',
      data: data,
    }
    store.dispatch(action);
  });
}

export function fetch_meetings() {
  api_get("/meetings").then((data) => {
    let action = {
      type: 'meetings/set',
      data: data,
    }
    store.dispatch(action);
  });
}

export function api_login(email, password) {
  return api_post("/session", {email, password}).then((data) => {
    if (data.session) {
      let action = {
        type: 'session/set',
        data: data.session,
      }
      store.dispatch(action);
    }
    else if (data.error) {
      let action = {
        type: 'error/set',
        data: data.error,
      };
      store.dispatch(action);
    }
  });
}

export function create_user(user) {
  return api_post("/users", {user});
}

export function show_user(id) {
  return api_get(`/users/${id}`);
}

export function update_user(id, data) {
  return api_update(`/users/${id}`, data);
}

export function delete_user(id) {
  return api_delete( `/users/${id}`);
}

export function create_meeting(meeting) {
  return api_post("/meetings", {meeting});
}

export function show_meeting(id) {
  return api_get(`/meetings/${id}`)
}

export function delete_meeting(id) {
  return api_delete(`/meetings/${id}`);
}

export function update_meeting(id, data) {
  return api_update(`/meetings/${id}`, data);
}

export function create_invite(invite) {
  return api_post("/invites", {invite});
}

export function delete_invite(id) {
  return api_delete(`/invites/${id}`);
}

export function update_invite(id, data) {
  return api_update(`/invites/${id}`, data);
}

export function all_invites() {
  return api_get('/invites');
}

export function create_comment(comment) {
  return api_post("/comments", {comment});
}

export function delete_comment(id) {
  return api_delete(`/comments/${id}`);
}



export function load_defaults() {
  fetch_meetings();
  fetch_users();
}