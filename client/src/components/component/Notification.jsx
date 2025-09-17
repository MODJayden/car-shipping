import React, { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Package,
  User,
  X,
  ChevronRight,
  Eye,
  Trash2,
  CheckCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getNotificationsByRecipient,
  markAsRead,
  markAllAsRead,
} from "../../store/notification";
import { useDispatch, useSelector } from "react-redux";

const NotificationDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  notifications,
  unreadCount,
}) => {
  const { user } = useSelector((state) => state?.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotificationsByRecipient(user?.id));
  }, [dispatch, user?.id]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order-confirmation":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "order-shipped":
        return <Package className="w-4 h-4 text-blue-500" />;
      case "payment-received":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "account-alert":
        return <User className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return "Just now";
    }
  };

  const markNoteAsRead = (id) => {
    dispatch(markAsRead(id)).then((res) => {
      if (res.payload.success) {
        dispatch(getNotificationsByRecipient(user?.id));
      }
    });
  };

  const markAllAsReads = () => {
    dispatch(markAllAsRead(user?.id)).then((res) => {
      if (res.payload.success) {
        dispatch(getNotificationsByRecipient(user?.id));
      }
    });
  };

  const deleteNotification = (id) => {
    "";
  };

  const clearAllNotifications = () => {
    "";
  };

  return (
    <>
      {/* Notification Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </DialogTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsReads}
                    className="text-xs h-8 px-2 text-blue-600 hover:text-blue-700"
                  >
                    <CheckCheck className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Badge variant="outline" className="text-xs">
                  {notifications.length}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {/* Notifications List */}
          <ScrollArea className="max-h-96">
            {notifications.length > 0 ? (
              <div className="p-2">
                {notifications.map((notification) => (
                  <Card
                    key={notification._id}
                    className={`mb-2 border-0 shadow-none transition-all duration-200 ${
                      notification.read
                        ? "bg-gray-50/50 dark:bg-gray-800/50"
                        : "bg-blue-50/50 dark:bg-blue-900/20"
                    } hover:bg-blue-100/30 dark:hover:bg-blue-900/30`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4
                              className={`font-medium text-sm ${
                                notification.read
                                  ? "text-gray-700 dark:text-gray-300"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(notification.createdAt)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-red-500"
                                onClick={() =>
                                  deleteNotification(notification._id)
                                }
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                              {notification.email.sent && (
                                <span className="flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  Email
                                </span>
                              )}
                              {notification.sms.sent && (
                                <span className="flex items-center">
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  SMS
                                </span>
                              )}
                            </div>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-blue-600 hover:text-blue-700"
                                onClick={() => markNoteAsRead(notification._id)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Mark read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-1">
                  No notifications
                </h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  You're all caught up!
                </p>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  View all notifications
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 text-red-600 hover:text-red-700"
                  onClick={clearAllNotifications}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationDialog;
