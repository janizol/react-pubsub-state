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