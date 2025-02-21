import React, { useEffect, useRef, useState } from "react";
import "./Notification.css";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationTabValue } from "../../Redux/TabsValue/tabsValueSlice";
import avatar from "../../assets/avatar.jpg";
import { BsCheckAll } from "react-icons/bs";
import autoAnimate from "@formkit/auto-animate";
import { getAllNotifications, markAllNotificationRead, updateNotification } from "./redux/thunk";
import { dateFormater } from "../../Utils/dateFormater";
import { notificationTime } from "../../Utils/notificationTime";
import NotificationSkeleton from "../../Components/Skeleton/NotificationSkeleton";
const Notification = ({ setPostsPerPage }) => {
  const dispatch = useDispatch();
  // const [historyTab, setHistoryTab] = useState(true);
  const [notificationTab, setNotificationTab] = useState(true);
  const notifications = useSelector((state) => state?.notification?.notifications);
  const { permissions, isSuperuser } = useSelector((state) => state.auth);
  const parent = useRef(null);
  const { next, count, loading } = useSelector((state) => state.notification);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  const scrollToEnd = () => {
    setPostsPerPage((prev) => prev + 10);
  };
  const handleScroll = (event) => {
    if (event.currentTarget.scrollTop + event.currentTarget.offsetHeight >= event.currentTarget.scrollHeight - 1) {
      if (next) {
        scrollToEnd();
      }
    }
  };
  return (
    <>
      <div className="notification-wrapper" ref={parent} onClick={(e) => e.stopPropagation()}>
        <div className="d-flex px-4 pt-4 pb-3 justify-content-between align-items-end">
          <h1 className="m-0" style={{ fontSize: "20px" }}>
            Notifications
            <span style={{ fontSize: "14px", color: "#008eb0" }}>({notifications && count})</span>
          </h1>
          <button type="button" className="btn p-0" style={{ boxShadow: "none", fontSize: "12px", color: "#008eb0", height: "min-content" }}>
            {/* See All Notification */}
          </button>
        </div>

        <div className="notification" style={{ width: "350px" }} onClick={(e) => e.stopPropagation()}>
          <div className="notification-card-wrapper" onScroll={handleScroll}>
            {notifications &&
              notifications?.map((notification, index) => {
                return (
                  <div
                    className={`notification-card border-top w-100 ${notification.isRead ? "" : "unread"}`}
                    key={index}
                    onClick={async () => {
                      await dispatch(
                        updateNotification({
                          id: notification?.id,
                          body: { isRead: true },
                        })
                      );
                      dispatch(getAllNotifications());
                    }}
                  >
                    <img src={notification?.user?.photo} alt="notifier-logo" />
                    <div className="card-text">
                      <p className="notification-message">
                        <span>
                          {notification?.user?.fullName} {notification?.message?.action} &nbsp;
                          {notification?.message?.instanceName} {notification?.message?.instanceId}
                        </span>
                      </p>
                      <p className="date">Date: {dateFormater(notification?.message?.createdAt)}</p>
                    </div>
                    <div className="hour-alert">
                      {!notification.isRead ? <div className="alert"></div> : <div></div>}
                      <div className="hour">{notificationTime(notification.message.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
            {loading && (
              <>
                <NotificationSkeleton />
              </>
            )}
          </div>
          <div className="px-4 py-3 border-top d-flex" style={{ gap: "20px" }}>
            <button
              onClick={() => {
                dispatch(markAllNotificationRead());
                dispatch(getAllNotifications());
              }}
              className="btn "
              style={{
                background: "#028bb021",
                color: "#028bb0",
                width: "max-content",
                fontSize: "12px",
                boxShadow: "none",
              }}
            >
              <BsCheckAll size={16} className="mr-2" />
              Mark all as read
            </button>
          </div>
        </div>

        {/* {historyTab && (
          <div className="history " style={{ width: "350px" }} onClick={(e) => e.stopPropagation()}>
            <div className="notification-card  border-top w-100">
              <img src={avatar} alt="notifier-logo" />
              <div className="card-text">
                <p className="notification-message">
                  <span>Bhuwan Buda</span> added Lead <span>LL-00/SN-000065</span>
                </p>
                <p className="date"> Monday 11:41 am</p>
              </div>
              <div className="hour-alert">
                <div className="alert"></div>
                <div className="hour">9 min</div>
              </div>
            </div>
            <div className="notification-card border-top w-100">
              <img src={avatar} alt="notifier-logo" />
              <div className="card-text">
                <p className="notification-message">
                  <span>Paras Buda</span> added Lead <span>LL-00/SN-000065</span>
                </p>
                <p className="date"> Monday 11:41 am</p>
              </div>
              <div className="hour-alert">
                <div className="alert"></div>
                <div className="hour">9 min</div>
              </div>
            </div>
            <div className="px-4 py-3 border-top d-flex" style={{ gap: "20px" }}>
              <button
                className="btn"
                style={{
                  background: "#008eb0",
                  color: "white",
                  width: "max-content",
                  fontSize: "12px",
                  boxShadow: "none",
                }}
              >
                View all
              </button>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default Notification;
