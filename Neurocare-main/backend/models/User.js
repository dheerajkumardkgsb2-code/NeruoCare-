import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "counsellor"],
      required: true,
    },
    fullName : {
      type: String,
    },
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId; 
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return !this.password; 
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    idCard: {
      type: String, 
    },
    collegeName: {
      type: String,
      trim: true,
    },
    academicYear: {
      type: String,
    },
    dob: {
      type: Date,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("validate", function (next) {
  if (!this.password && !this.googleId) {
    next(new Error("User must have either a password or a googleId."));
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

export default User;
