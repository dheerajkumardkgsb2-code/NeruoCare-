function UserListItem({ user, handleFunction }) {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center w-full px-3 py-2 mb-2 text-black transition-colors duration-200 bg-gray-100 rounded-lg cursor-pointer hover:bg-teal-500 hover:text-white"
    >
      <img
        className="w-8 h-8 mr-2 rounded-full object-cover"
        src={user?.profilePic}
        alt={user?.username}
      />
      <div>
        <p className="font-semibold">{user?.username}</p>
        <p className="text-xs">
          <b>Email:</b> {user?.email}
        </p>
      </div>
    </div>
  );
}

export default UserListItem;
