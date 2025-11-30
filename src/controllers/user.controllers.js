import {
  createUserAdmin,
  deleteUserModel,
  editUserModel,
  getAllUser,
  getUserById,
  getUserProfile,
  updateUserProfile,
} from "../models/user.model.js";



/**
 * GET /users
 * @summary Get all users with pagination & search
 * @tags Admin User
 * @security bearerAuth
 *
 * @param {string} search.query - Search user by fullname or email (optional)
 * @param {number} page.query - Page number (default: 1)
 * @param {number} limit.query - Items per page (default: 10)
 *
 * @return {object} 200 - Users fetched successfully
 * @return {object} 500 - Failed to fetch users
 */
export async function getAllUsersController(req, res) {
  try {
    const { page, limit, search } = req.query;

    const { data, pagination, links } = await getAllUser({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search || "",
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      pagination,
      links,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal Mengambil user",
      error: err.message,
    });
  }
}

/**
 * GET /users/{id}
 * @summary Get user detail by ID
 * @tags Admin User
 * @security bearerAuth
 *
 * @param {number} id.path - User ID
 *
 * @return {object} 200 - User fetched successfully
 * @return {object} 400 - Invalid user ID
 * @return {object} 404 - User not found
 * @return {object} 500 - Failed to fetch user
 */
export async function getUserByIdController(req, res) {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "User ID tidak valid",
      });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const responseData = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: user.profile || {},
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: responseData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil user",
      error: err.message,
    });
  }
}


/**
 * Create user request body
 * @typedef {object} CreateUserRequest
 * @property {string} image - User profile photo - binary
 * @property {string} fullname.required - Full name of user
 * @property {string} email.required - Email of user
 * @property {string} password.required - Password
 * @property {string} phone - Phone number
 * @property {string} address - Address
 * @property {string} role - Role of user - enum:user,admin
 */

/**
 * POST /users
 * @summary Create a new user (Admin only)
 * @tags Admin User
 * @security bearerAuth
 *
 * @description Membuat user baru dengan optional upload image (jpeg/jpg/png max 2MB).
 * @param {CreateUserRequest} request.body.required - User data - multipart/form-data
 * @return {object} 201 - User berhasil dibuat
 * @return {object} 400 - Validasi gagal (input salah / file invalid)
 * @return {object} 500 - Gagal membuat user
 */
export async function addUserController(req, res) {
  try {
    const { fullname, email, password, phone, address, role } = req.body;
    const file = req.file;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fullname, email, dan password harus diisi",
      });
    }

    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "File type tidak valid. Hanya jpeg, jpg, png yang diperbolehkan.",
        });
      }

      const maxSize = 2 * 1024 * 1024; 
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: "Ukuran file terlalu besar. Maksimal 2MB.",
        });
      }
    }

    const image = file ? file.filename : null;

    const newUser = await createUserAdmin({
      fullname,
      email,
      password,
      phone,
      address,
      role,
      image,
    });

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      data: newUser,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal membuat user baru",
      error: err.message,
    });
  }
}

/**
 * Update user request body
 * @typedef {object} UpdateUserRequest
 * @property {string} image - User profile photo - binary
 * @property {string} fullname - Full name of user
 * @property {string} email - Email of user
 * @property {string} password - Password baru (opsional)
 * @property {string} phone - Phone number
 * @property {string} address - Address
 */

/**
 * PATCH /users/{id}
 * @summary Update existing user (Admin only)
 * @tags Admin User
 * @security bearerAuth
 *
 * @description Memperbarui data user dengan optional upload image (jpeg/jpg/png max 2MB). Password baru opsional.
 * @param {integer} id.path.required - ID user yang akan diupdate
 * @param {UpdateUserRequest} request.body.required - Data user yang akan diperbarui - multipart/form-data
 * @return {object} 200 - User berhasil diperbarui
 * @return {object} 400 - Validasi gagal (input salah / file invalid / user tidak ditemukan)
 * @return {object} 500 - Gagal memperbarui user
 */
export async function editUserController(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const { fullname, email, password, phone, address } = req.body;
    const file = req.file;

    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "File type tidak valid. Hanya jpeg, jpg, png yang diperbolehkan.",
        });
      }

      const maxSize = 2 * 1024 * 1024; 
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: "Ukuran file terlalu besar. Maksimal 2MB.",
        });
      }
    }

    const updatedUser = await editUserModel({
      userId,
      fullname,
      email,
      password,
      phone,
      address,
      file, 
    });

    res.status(200).json({
      success: true,
      message: "User berhasil diperbarui",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui user",
      error: err.message,
    });
  }
}


/**
 * DELETE /users/{id}
 * @summary Delete user by ID (Admin only)
 * @tags Admin User
 * @security bearerAuth
 *
 * @description Menghapus user beserta relasi terkait (transaction, cart, forgotPassword, profile).
 *
 * @param {number} id.path.required - ID user yang akan dihapus
 *
 * @return {object} 200 - User berhasil dihapus
 * @return {object} 404 - User tidak ditemukan
 * @return {object} 500 - Gagal menghapus user
 */
export async function deleteUserController(req, res) {
  try {
    const userId = parseInt(req.params.id);

    const deletedUser = await deleteUserModel(userId);

    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
      data: deletedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus user",
      error: err.message,
    });
  }
}


/**
 * GET /users/profile
 * @summary Get logged-in user's profile
 * @tags User Profile
 * @security bearerAuth
 * @return {object} 200 - Profile fetched successfully
 * @return {object} 401 - Unauthorized (invalid/missing token)
 * @return {object} 404 - Profile not found
 * @return {object} 500 - Server error
 */
export async function getUserProfileController(req, res){
  try {
    const userId = req.jwtPayload.id;

    const profile = await getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        id: profile.id,
        fullname: profile.fullname,
        email: profile.email,
        phone: profile.profile?.phone ?? null,
        address: profile.profile?.address ?? null,
        image: profile.profile?.image ?? null,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: err.message,
    });
  }
}


/**
 * Update logged-in user profile
 * @typedef {object} UpdateUserProfileRequest
 * @property {string} fullname - Full name of user 
 * @property {string} email - Email of user 
 * @property {string} phone - Phone number 
 * @property {string} address - Address 
 * @property {string} image - Profile photo - binary 
 */

/**
 * PATCH /users/profile
 * @summary Update logged-in user's profile (optional fields)
 * @tags User Profile
 * @security bearerAuth
 *
 * @description Update profile for the logged-in user. All fields are optional. You can upload a profile photo (jpeg/jpg/png, max 2MB) or update any combination of fullname, email, phone, address.
 * @param {UpdateUserProfileRequest} request.body.required - User profile data - multipart/form-data
 * @return {object} 200 - Profile updated successfully
 * @return {object} 400 - Invalid input / file too large / invalid file type
 * @return {object} 401 - Unauthorized (invalid/missing token)
 * @return {object} 500 - Server error
 */
export async function updateUserProfileController(req, res) {
  try {
    const userId = req.jwtPayload.id;
    const body = req.body || {}; 
    const file = req.file;

    const fullname = body.fullname;
    const email = body.email;
    const phone = body.phone;
    const address = body.address;

    if (!fullname && !email && !phone && !address && !file) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data untuk diupdate",
      });
    }

    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const maxSize = 2 * 1024 * 1024; 
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "File type tidak valid. Hanya jpeg, jpg, png yang diperbolehkan.",
        });
      }
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: "Ukuran file terlalu besar. Maksimal 2MB.",
        });
      }
    }

    const userData = fullname || email ? { ...(fullname && { fullname }), ...(email && { email }) } : {};
    const profileData = {
      ...(phone && { phone }),
      ...(address && { address }),
      ...(file && { image: file.path }),
    };

    const updatedProfile = await updateUserProfile(userId, userData, profileData);

    res.status(200).json({
      success: true,
      message: "Profile berhasil diupdate",
      data: {
        id: updatedProfile.id,
        fullname: updatedProfile.fullname,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        address: updatedProfile.address,
        image: updatedProfile.image,
        createdAt: updatedProfile.created_at,
        updatedAt: updatedProfile.updated_at,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal update profile",
      error: err.message,
    });
  }
}