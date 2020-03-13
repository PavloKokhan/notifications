import React, {useState} from 'react';
import { BellOutlined, CloseOutlined, MessageOutlined, RollbackOutlined, NotificationOutlined } from '@ant-design/icons';
import {NotificationType} from "../models/notification"
import { Badge, List } from 'antd';
import CustomScroll from 'react-custom-scroll';
import  'react-custom-scroll/dist/customScroll.css';
import './Notification.scss';
import 'antd/dist/antd.css';

export interface NotificationProps {
  handleInfiniteOnLoad: () => void
  filterNotifications: (notifications: Array<NotificationType>) => void
  setCount: any
  count: number
  notifications: Array<NotificationType>
}

function Notification(props: NotificationProps) {
  const [active, setActive] = useState<boolean>(false)
  const [notification, setNotification] = useState<any>({});

  let Icon: any;
  if (active) {
      Icon = <CloseOutlined className="notification__bell" style={{color: '#fff' }} />;
  } else {
      Icon = <BellOutlined className="notification__bell" style={{color: '#fff' }} />;
  }

  function handleClick(): void {
      setActive(!active);
  }

  function handleBack(): void {
    setNotification({});
  }

  function handleView(e: any): void {
    const {target} = e;

    const id: string = target.dataset.id;
    let storage: any = localStorage.getItem('viewed');
    let viewed: Array<string>;

    if (storage) {
      viewed = JSON.parse(storage);
      viewed.push(id);
    } else {
      viewed = [id];
    }

    localStorage.setItem('viewed', JSON.stringify(viewed));
    props.filterNotifications(props.notifications);
    props.setCount(props.count - 1);
    setNotification(props.notifications.find((item ) => item.id === id))
  }

  return (
    <div className='notification'>
      <Badge count={props.count} showZero={true}>
        <div className="notification__badge-wrapper" onClick={handleClick}>
          {Icon}
        </div>
      </Badge>

      <div className={`notification__list-wrapper ${active ? 'opened' : 'hidden'}`}>
        <h2 className="notification__list-header">
          {
            Object.keys(notification).length ?
              <span
                className='notification__back'
                onClick={handleBack}
              >
                      <RollbackOutlined/> {notification.title}
                    </span>
              : 'Notifications'
          }
        </h2>
        <CustomScroll>
          <div className="demo-infinite-container">
            <List
              itemLayout="horizontal"
              dataSource={props.notifications}
              renderItem={(item: NotificationType, i: number) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<MessageOutlined style={{fontSize: '24px'}} />}
                    title={
                      <div
                        className="notification__item-header"
                        data-id={item.id}
                        onClick={e => handleView(e)}
                      >
                        {item.title}
                      </div>
                    }
                    description={`${item.text.slice(0, 120)} ...`}
                  />
                </List.Item>
              )}
            >
            </List>
          </div>
        </CustomScroll>


          <div className={`notification__view ${Object.keys(notification).length ? 'in' : 'out'}`}>
            <CustomScroll flex='1'>
              <div className="notification__view-content">
                <div>
                  <NotificationOutlined style={{fontSize: '18px', marginBottom: '10px'}} />
                </div>
                {
                  Object.keys(notification).length ?
                    <p className='notification__description'>{notification.text}</p> : ''
                }
              </div>
            </CustomScroll>
          </div>

      </div>
    </div>
  );
}

export default Notification;
