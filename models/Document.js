const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileNumber: {
    type: Number,
    required: [true, "文件編號為必填項"],
    // 移除 trim 屬性
  },
  user: {
    type: String,
    required: [true, "人員為必填項"],
  },
  title: {
    type: String,
    required: [true, "主旨為必填項"],
  },
  remark: {
    type: String,
    required: false,
    trim: true,
  },
  currentUnit: {
    type: String,
    required: [
      function () {
        // 当文件未刷出时，currentUnit 为必填
        return !this.isSpawned;
      },
      "單位為必填項",
    ],
    trim: true,
  },
  isSpawned: {
    type: Boolean,
    default: false,
  },
  currentUnitRemark: {
    type: String,
    required: false,
    trim: true,
  },
  flashTime: {
    type: Date,
    default: Date.now,
  },
  spawnTime: {
    type: Date,
    default: Date.now,
  },
  flashHistory: [
    {
      time: {
        type: Date,
        default: Date.now,
      },
      unit: {
        type: String,
        required: true,
      },
      remark: {
        type: String,
        required: false,
        trim: true,
      },
    },
  ],
  spawnHistory: [
    {
      time: {
        type: Date,
        default: Date.now,
      },
      remark: {
        type: String,
        required: false,
        trim: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
