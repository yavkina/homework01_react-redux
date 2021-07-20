import React, { useState } from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { connect, Provider } from "react-redux";

const UserActions = {
  add: (user) => ({
    type: "User/ADD",
    payload: {
      id: randomId(),
      name: user.name,
      password: user.password,
    },
  }),
  delete: (id) => ({
    type: "User/DELETE",
    payload: {
      id: id,
    },
  }),
  edit: (editUser) => ({
    type: "User/EDIT",
    payload: {
      id: editUser.id,
      name: editUser.name,
      password: editUser.password,
    },
  }),
};

function randomId() {
  return Math.ceil(Math.random() * 1000000000);
}

function reducer(state = [], action) {
  let nextState = state;

  if (action.type === "User/ADD") {
    const repeatUser = state.findIndex(
      (user) => user.name === action.payload.name
    );

    if (repeatUser === -1) {
      nextState = [...state, { ...action.payload }];
    } else {
      alert("User with the same name is already exist!");
    }
  }

  if (action.type === "User/DELETE") {
    nextState = state.filter((user) => user.id !== action.payload.id);
  }

  if (action.type === "User/EDIT") {
    const index = state.findIndex((user) => user.id === action.payload.id);

    nextState = [
      ...state.slice(0, index),
      { ...state[index], ...action.payload },
      ...state.slice(index + 1),
    ];
  }

  return nextState;
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const Users = ({ users, onAdd, onDelete, onEdit }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isEdit, setEdit] = useState(false);

  return (
    <>
      <h3>Users</h3>
      <div>
        <input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={() => {
            setName("");
            setPassword("");
            onAdd({ name: name, password: password });
          }}
        >
          Add user
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <td>User</td>
            <td>Password</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.password}</td>
              <td>
                <button onClick={() => onDelete(user.id)}>Delete</button>
              </td>
              <td>
                {isEdit ? (
                  <button
                    onClick={() => {
                      onEdit({ id: user.id, name: name, password: password });
                      setName("");
                      setPassword("");
                      setEdit(false);
                    }}
                  >
                    Save user
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setName(user.name);
                      setPassword(user.password);
                      setEdit(true);
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const ConnectedUsers = connect(
  (state) => ({ users: state }),
  (dispatch) => ({
    onAdd: (user) => dispatch(UserActions.add(user)),
    onDelete: (id) => dispatch(UserActions.delete(id)),
    onEdit: (editUser) => dispatch(UserActions.edit(editUser)),
  })
)(Users);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedUsers />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
