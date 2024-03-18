# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh




```
import React, { createContext, useContext, useState } from 'react';

// PubSub implementation
const PubSub = {
  subscribers: {},
  subscribe: function(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  },
  publish: function(event, data) {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach(callback => callback(data));
  }
};

// Notifier component
const Notifier = () => {
  const [notifications, setNotifications] = useState([]);

  // Subscribe to 'notification' events
  PubSub.subscribe('notification', notification => {
    setNotifications(prevNotifications => [...prevNotifications, notification]);
    setTimeout(() => {
      setNotifications(prevNotifications =>
        prevNotifications.filter(n => n !== notification)
      );
    }, 3000);
  });

  return (
    <div className="notifier">
      {notifications.map((notification, index) => (
        <div key={index} className="notification">
          {notification}
        </div>
      ))}
    </div>
  );
};

// Context for state management
const StateContext = createContext();

// Custom hook to use the state context
const useStateContext = () => useContext(StateContext);

// Main component using context for state management
const MainComponent = () => {
  const { state, setState } = useStateContext();

  const handleClick = () => {
    // Publish a notification event
    PubSub.publish('notification', 'Button clicked!');
  };

  return (
    <div>
      <h1>{state}</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

// Wrapper component to provide state context
const StateProvider = ({ children }) => {
  const [state, setState] = useState('Initial State');

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

// App component
const App = () => {
  return (
    <StateProvider>
      <Notifier />
      <MainComponent />
    </StateProvider>
  );
};

export default App;
```


This example consists of three main components:

Notifier: This component subscribes to 'notification' events and displays notifications when they are published.

MainComponent: This is a simple component that displays a state value and has a button. When the button is clicked, it publishes a 'notification' event.

App: This is the root component where the StateProvider wraps both Notifier and MainComponent, providing the state context to them.

The PubSub object facilitates publishing and subscribing to events, allowing different components to communicate without being directly coupled.

The Notifier component listens for 'notification' events and displays them as notifications. When a new notification is received, it adds it to the state and removes it after 3 seconds.

This setup demonstrates a simple implementation of state management, pubsub pattern, and notifications in a React application.





