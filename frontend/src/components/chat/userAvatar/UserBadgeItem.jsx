import { X } from "lucide-react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <span
      onClick={handleFunction}
      className="inline-flex items-center px-2 py-1 m-1 mb-2 text-xs font-medium text-white bg-purple-600 rounded-lg cursor-pointer hover:bg-purple-700"
    >
      {user?.username}
      {admin === user._id && <span className="ml-1">(Admin)</span>}
      <X size={12} className="ml-1" />
    </span>
  );
};

export default UserBadgeItem;
