
const path = require('path');
const Media = require('../models/media');

// const createMedia = async (req, res) => {
//     try {
//         const { category } = req.body;
//         if (!req?.files || req?.files?.length === 0) {
//             return res.status(404).json({success : false,message :"Something went wrong!"});
//         }

//         // Map through req.files and create documents
//         const mediaDocs = req?.files?.map((file) => ({
//             filename: file.filename,
//             originalname: file.originalname,
//             url: `${process.env.SERVER_URL}/media/${file.filename}`,
//             size: file.size,
//             category: category,
//             fileType: path.extname(file.originalname)
//         }));

//         const isCreated = await Media.create(mediaDocs);

//         if (!isCreated || isCreated.length === 0 ){
//             return res.status(404).json({success : false,message :"Something went wrong!"});
//         }
//         return res.status(200).json({success : true,data : isCreated,message :"Media created successfully!"});
//     } catch (error) {
//         return res.status(500).json({success : false,message :error.message});

//     }
// };
const createMedia = async (req, res) => {
    try {
      const { category } = req.body;
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: "No files were uploaded" 
        });
      }
  
      // Validate category exists
      if (!category) {
        return res.status(400).json({ 
          success: false,
          message: "Category is required" 
        });
      }
  
      // Process each file
      const mediaDocs = req.files.map((file) => {
        // Validate file properties
        if (!file.originalname || !file.filename || !file.size) {
          throw new Error("Invalid file properties");
        }
  
        const extension = path.extname(file.originalname).toLowerCase();
        const isImage = [
            '.jpg', '.jpeg', '.png', 
            '.gif', '.webp', '.svg'
          ].includes(extension.toLowerCase());
        const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(extension);
        
        return {
          filename: file.filename,
          originalname: file.originalname,
          url: `${process.env.SERVER_URL}/media/${file.filename}`,
          size: file.size,
          category: category,
          fileType: extension,
          type: isImage ? 'image' : isVideo ? 'video' : 'other'
        };
      });
  
      const createdMedia = await Media.insertMany(mediaDocs);
  
      if (!createdMedia || createdMedia.length === 0) {
        return res.status(500).json({ 
          success: false,
          message: "Failed to save media to database" 
        });
      }
  
      return res.status(200).json({
        success: true,
        data: createdMedia,
        message: "Media created successfully!"
      });
  
    } catch (error) {
      console.error("Media creation error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error"
      });
    }
  };

const getMedias = async (req, res) => {
    try {
        const medias = await Media.find({}).select("-filename -updatedAt -__v").sort({ createdAt: -1 });

        if (!medias || medias?.length === 0) return res.status(404).json({success : false,message :  "Media not found!"})

        return res.status(200).json({success : true,data : medias,message :"All media gets successfully..!"});
    } catch (error) {
        return res.status(500).json({success : false,message :error.message});
    }
};

const getMedia = async (req, res) => {
    try {
        const { id } = req.params.id;

        const media = await Media.findOne({ _id: id });

        if (!media) return res.status(404).json({success : false,message :  "Media not found!"})

        return res.status(200).json({success : true,data : media,message :  "Media get successfully...!"})
    } catch (error) {
        return res.status(500).json({success : false,message :error.message});

    }
};

const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findByIdAndDelete(id);

        if (!media) {
            return res.status(404).json({success : false,message :  "Media not found!"})
        }

        return res.status(200).json({success : true,message :  "Media deleted successfully...!"})
    } catch (error) {
        return res.status(500).json({success : false,message :error.message});

    }
};

const getCategoryMedia = async (req, res) => {
    try {
        const { category } = req.params;

        const query = category === "all" ? {} : { category };

        const medias = await Media.find(query).select("-filename -size -__v -updatedAt").sort({ createdAt: -1 });

        if (!medias || medias?.length === 0) return sendSuccessResponse(res, "Media not found!", [], 200);
        return res.status(200).json({success : true,data : medias,message : "Category medias get succesfully"})
    } catch (error) {
        return res.status(500).json({success : false,message :error.message});

    }
}

module.exports = {
    createMedia,
    getMedias,
    getMedia,
    deleteMedia,
    getCategoryMedia
}