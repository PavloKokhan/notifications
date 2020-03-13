import React, {useState, useEffect} from 'react';
import {getNotifications} from "./services/notificationServices";
import './App.scss';
import Notification from "./components/Notification"
import {NotificationType} from "./models/notification"
import 'antd/dist/antd.css';

function App() {
  const [count, setCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Array<NotificationType>>([]);
  const date = Date.now();

  useEffect(() => {
    (async () => {
      const res = await getNotifications();
      localStorage.clear();

      setNotifications(res.data);
      setCount(res.meta.total);
    })();

    const interval = setInterval(() => {
        setNotifications((not ) => {
            const arr = not.filter((item) => {
             return +item.expired + date > Date.now()
            })

            setCount(arr.length);
            if (arr.length === 0) {
                clearInterval(interval);
                console.log('cleared')
            }
            return arr;
        })
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function handleInfiniteOnLoad() {
    const res = await getNotifications();
    const copy = JSON.parse(JSON.stringify(res));

    copy.data.forEach((item: NotificationType) => {
        item.id += Date.now();
        item.title += Math.floor(Math.random() * (100 - 10) + 10);
    })

    setNotifications(notifications.concat(copy.data));

  }

  function filterNotifications(notifications: Array<NotificationType>) {
    const viewed = JSON.parse(localStorage.getItem('viewed') as string)
    const arr = notifications.filter(item => !viewed.includes(item.id));
    setNotifications(arr);
  }

  return (
    <div className="app">
      <Notification
        count={count}
        notifications={notifications}
        handleInfiniteOnLoad={handleInfiniteOnLoad}
        filterNotifications={filterNotifications}
        setCount={setCount}
      />
    </div>
  );
}

export default App;
