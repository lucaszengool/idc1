"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.getUserProfile = exports.updateUserProfile = exports.registerUser = exports.loginWithAccessKey = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const crypto_1 = __importDefault(require("crypto"));
const loginWithAccessKey = async (req, res) => {
    try {
        const { username, role } = req.body;
        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }
        // 查找或创建用户
        let user = await models_1.User.findOne({
            where: { username, isActive: true },
            include: [
                {
                    model: models_1.GroupMember,
                    as: 'groupMemberships',
                    include: [
                        {
                            model: models_1.Group,
                            as: 'group',
                            include: [
                                {
                                    model: models_1.User,
                                    as: 'pm',
                                    attributes: ['id', 'username', 'displayName']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: models_1.Group,
                    as: 'managedGroups'
                }
            ]
        });
        // 如果用户不存在，创建新用户
        if (!user) {
            if (!role || !['employee', 'pm'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Role selection required for new user',
                    requiresRoleSelection: true
                });
            }
            // 生成唯一的access key
            let accessKey = '';
            let isUnique = false;
            while (!isUnique) {
                accessKey = crypto_1.default.randomBytes(16).toString('hex');
                const existingKey = await models_1.User.findOne({ where: { accessKey } });
                if (!existingKey) {
                    isUnique = true;
                }
            }
            // 创建新用户
            user = await models_1.User.create({
                accessKey,
                username,
                displayName: username, // 使用用户名作为显示名
                role,
                isActive: true
            });
            // 重新查询以包含关联数据
            user = await models_1.User.findByPk(user.id, {
                include: [
                    {
                        model: models_1.GroupMember,
                        as: 'groupMemberships',
                        include: [
                            {
                                model: models_1.Group,
                                as: 'group',
                                include: [
                                    {
                                        model: models_1.User,
                                        as: 'pm',
                                        attributes: ['id', 'username', 'displayName']
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: models_1.Group,
                        as: 'managedGroups'
                    }
                ]
            });
        }
        // 确保用户存在后再进行操作
        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create or find user'
            });
        }
        // 更新最后登录时间
        await user.update({ lastLoginAt: new Date() });
        // 返回用户信息和组信息
        const userInfo = {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            department: user.department,
            position: user.position,
            phone: user.phone,
            accessKey: user.accessKey, // 添加 accessKey
            groups: [],
            managedGroups: []
        };
        res.json({
            success: true,
            data: userInfo,
            message: 'Login successful'
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};
exports.loginWithAccessKey = loginWithAccessKey;
const registerUser = async (req, res) => {
    try {
        const { username, displayName, email, role = 'employee', department, position, phone } = req.body;
        if (!username || !displayName) {
            return res.status(400).json({
                success: false,
                message: 'Username and display name are required'
            });
        }
        // 检查用户名是否已存在
        const existingUser = await models_1.User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }
        // 生成唯一的access key
        let accessKey = '';
        let isUnique = false;
        while (!isUnique) {
            accessKey = crypto_1.default.randomBytes(16).toString('hex');
            const existingKey = await models_1.User.findOne({ where: { accessKey } });
            if (!existingKey) {
                isUnique = true;
            }
        }
        // 创建用户
        const user = await models_1.User.create({
            accessKey,
            username,
            displayName,
            email,
            role,
            department,
            position,
            phone
        });
        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                accessKey: user.accessKey,
                role: user.role,
                department: user.department,
                position: user.position
            },
            message: 'User registered successfully'
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
};
exports.registerUser = registerUser;
const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { displayName, email, department, position, phone, role } = req.body;
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // 允许修改role
        await user.update({
            displayName,
            email,
            department,
            position,
            phone,
            role
        });
        res.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                role: user.role,
                department: user.department,
                position: user.position,
                phone: user.phone
            }
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};
exports.updateUserProfile = updateUserProfile;
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await models_1.User.findByPk(userId, {
            include: [
                {
                    model: models_1.GroupMember,
                    as: 'groupMemberships',
                    include: [
                        {
                            model: models_1.Group,
                            as: 'group'
                        }
                    ]
                },
                {
                    model: models_1.Group,
                    as: 'managedGroups'
                }
            ]
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const userInfo = {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            department: user.department,
            position: user.position,
            phone: user.phone,
            groups: [],
            managedGroups: [],
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt
        };
        res.json({
            success: true,
            data: userInfo
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile'
        });
    }
};
exports.getUserProfile = getUserProfile;
const searchUsers = async (req, res) => {
    try {
        const { query, role } = req.query;
        const whereClause = {
            isActive: true
        };
        if (query) {
            whereClause[sequelize_1.Op.or] = [
                { username: { [sequelize_1.Op.iLike]: `%${query}%` } },
                { displayName: { [sequelize_1.Op.iLike]: `%${query}%` } }
            ];
        }
        if (role) {
            whereClause.role = role;
        }
        const users = await models_1.User.findAll({
            where: whereClause,
            attributes: ['id', 'username', 'displayName', 'role', 'department', 'position'],
            limit: 20
        });
        res.json({
            success: true,
            data: users
        });
    }
    catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search users'
        });
    }
};
exports.searchUsers = searchUsers;
//# sourceMappingURL=authController.js.map