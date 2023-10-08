import Upload from "../models/Upload.js";
import { v2 as cloudinary } from "cloudinary";
import moment from "moment";

export async function uploadNewFile(req, res) {
  const user = res.user;
  if (!user) {
    return res.status(401).json("User not found!");
  }
  
  console.log(req);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Upload the image to Cloudinary
  cloudinary.uploader
    .upload_stream({ resource_type: "image" }, (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "Could not upload to Cloudinary" });
      }
      const imageUrl = result.secure_url;
      const newUpload = new Upload({
        userId: user._id,
        secretUrl: imageUrl,
        title: req.body.title,
        description: req.body.description,
      });
      newUpload.save();
      res.status(200).json({ imageUrl });
    })
    .end(req.file.buffer);
}

export async function deleteUpload(req, res) {
  const uploadId = req.params.id;
  try {
    const upload = await Upload.findById(uploadId.toString());
    if (!upload) {
      return res.status(404).json("Upload File not found!");
    }
    await Upload.findByIdAndDelete(uploadId);
    return res.status(204).json("Uploaded File deleted!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export async function getAllUploads(req, res) {
  const user = res.user;
  try {
    const uploads = await Upload.find({ userId: user._id });
    const count = await Upload.count({ userId: user._id });
    const uploadsWithDate = uploads.map((upload) => ({
      ...upload.toObject(),
      date: moment(upload.createdAt).format("DD-MM-YYYY"),
    }));
    return res.status(200).json({ uploads: uploadsWithDate, count: count });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
