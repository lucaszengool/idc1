"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGroup = exports.searchUsersForGroup = exports.removeGroupMember = exports.addGroupMember = exports.getGroups = exports.createGroup = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const createGroup = async (req, res) => {
    try {
        const { groupName, description, pmId, createdBy } = req.body;
        if (!groupName || !pmId || !createdBy) {
            return res.status(400).json({
                success: false,
                message: 'Group name, PM ID, and creator ID are required'
            });
        }
        // 验证PM是否为PM角色
        const pm = await models_1.User.findByPk(pmId);
        if (!pm || pm.role !== 'pm') {
            return res.status(400).json({
                success: false,
                message: 'PM must have PM role'
            });
        }
        // 创建组
        const group = await models_1.Group.create({
            groupName,
            description,
            pmId,
            createdBy
        });
        // 自动将PM添加到组中
        await models_1.GroupMember.create({
            groupId: group.id,
            userId: pmId,
            addedBy: createdBy
        });
        const groupWithPM = await models_1.Group.findByPk(group.id, {
            include: [
                {
                    model: models_1.User,
                    as: 'pm',
                    attributes: ['id', 'username', 'displayName', 'role']
                },
                {
                    model: models_1.GroupMember,
                    as: 'members',
                    include: [
                        {
                            model: models_1.User,
                            as: 'user',
                            attributes: ['id', 'username', 'displayName', 'role']
                        }
                    ]
                }
            ]
        });
        res.status(201).json({
            success: true,
            data: groupWithPM,
            message: 'Group created successfully'
        });
    }
    catch (error) {
        console.error('Create group error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create group'
        });
    }
};
exports.createGroup = createGroup;
const getGroups = async (req, res) => {
    try {
        const { userId } = req.query;
        let whereClause = {
            isActive: true
        };
        // 如果指定了用户ID，只返回该用户相关的组
        if (userId) {
            const user = await models_1.User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            // 如果是PM，返回管理的组和参与的组
            if (user.role === 'pm') {
                const groups = await models_1.Group.findAll({
                    where: {
                        isActive: true,
                        [sequelize_1.Op.or]: [
                            { pmId: parseInt(userId) },
                            { id: { [sequelize_1.Op.in]: await models_1.GroupMember.findAll({ where: { userId: parseInt(userId) }, attributes: ['groupId'] }).then(members => members.map(m => m.groupId)) } }
                        ]
                    },
                    include: [
                        {
                            model: models_1.User,
                            as: 'pm',
                            attributes: ['id', 'username', 'displayName', 'role']
                        },
                        {
                            model: models_1.GroupMember,
                            as: 'members',
                            include: [
                                {
                                    model: models_1.User,
                                    as: 'user',
                                    attributes: ['id', 'username', 'displayName', 'role']
                                }
                            ]
                        }
                    ]
                });
                return res.json({
                    success: true,
                    data: groups
                });
            }
        }
        const groups = await models_1.Group.findAll({
            where: whereClause,
            include: [
                {
                    model: models_1.User,
                    as: 'pm',
                    attributes: ['id', 'username', 'displayName', 'role']
                },
                {
                    model: models_1.GroupMember,
                    as: 'members',
                    include: [
                        {
                            model: models_1.User,
                            as: 'user',
                            attributes: ['id', 'username', 'displayName', 'role']
                        }
                    ]
                }
            ]
        });
        res.json({
            success: true,
            data: groups
        });
    }
    catch (error) {
        console.error('Get groups error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch groups'
        });
    }
};
exports.getGroups = getGroups;
const addGroupMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userId, addedBy } = req.body;
        if (!userId || !addedBy) {
            return res.status(400).json({
                success: false,
                message: 'User ID and adder ID are required'
            });
        }
        // 验证组是否存在
        const group = await models_1.Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }
        // 验证用户是否存在
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // 验证添加者是否为该组的PM
        if (group.pmId !== parseInt(addedBy)) {
            return res.status(403).json({
                success: false,
                message: 'Only group PM can add members'
            });
        }
        // 检查用户是否已在组中
        const existingMember = await models_1.GroupMember.findOne({
            where: {
                groupId,
                userId
            }
        });
        if (existingMember) {
            return res.status(400).json({
                success: false,
                message: 'User is already a member of this group'
            });
        }
        // 添加用户到组
        const groupMember = await models_1.GroupMember.create({
            groupId: parseInt(groupId),
            userId: parseInt(userId),
            addedBy: parseInt(addedBy)
        });
        const memberWithUser = await models_1.GroupMember.findByPk(groupMember.id, {
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'username', 'displayName', 'role']
                }
            ]
        });
        res.status(201).json({
            success: true,
            data: memberWithUser,
            message: 'Member added successfully'
        });
    }
    catch (error) {
        console.error('Add group member error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add group member'
        });
    }
};
exports.addGroupMember = addGroupMember;
const removeGroupMember = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const { removedBy } = req.body;
        // 验证组是否存在
        const group = await models_1.Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }
        // 验证移除者是否为该组的PM
        if (group.pmId !== parseInt(removedBy)) {
            return res.status(403).json({
                success: false,
                message: 'Only group PM can remove members'
            });
        }
        // 不能移除PM自己
        if (group.pmId === parseInt(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot remove PM from group'
            });
        }
        // 查找并删除组成员
        const member = await models_1.GroupMember.findOne({
            where: {
                groupId,
                userId
            }
        });
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'User is not a member of this group'
            });
        }
        await member.destroy();
        res.json({
            success: true,
            message: 'Member removed successfully'
        });
    }
    catch (error) {
        console.error('Remove group member error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove group member'
        });
    }
};
exports.removeGroupMember = removeGroupMember;
const searchUsersForGroup = async (req, res) => {
    try {
        const { query } = req.query;
        const { groupId } = req.params;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }
        // 获取已在组中的用户ID列表
        const existingMemberIds = await models_1.GroupMember.findAll({
            where: { groupId },
            attributes: ['userId']
        }).then(members => members.map(m => m.userId));
        // 搜索不在组中的用户
        const users = await models_1.User.findAll({
            where: {
                isActive: true,
                id: { [sequelize_1.Op.notIn]: existingMemberIds },
                [sequelize_1.Op.or]: [
                    { username: { [sequelize_1.Op.iLike]: `%${query}%` } },
                    { displayName: { [sequelize_1.Op.iLike]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'username', 'displayName', 'role', 'department', 'position'],
            limit: 10
        });
        res.json({
            success: true,
            data: users
        });
    }
    catch (error) {
        console.error('Search users for group error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search users'
        });
    }
};
exports.searchUsersForGroup = searchUsersForGroup;
const updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { groupName, description, updatedBy } = req.body;
        const group = await models_1.Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }
        // 验证更新者是否为该组的PM
        if (group.pmId !== parseInt(updatedBy)) {
            return res.status(403).json({
                success: false,
                message: 'Only group PM can update group information'
            });
        }
        await group.update({
            groupName,
            description
        });
        const updatedGroup = await models_1.Group.findByPk(groupId, {
            include: [
                {
                    model: models_1.User,
                    as: 'pm',
                    attributes: ['id', 'username', 'displayName', 'role']
                },
                {
                    model: models_1.GroupMember,
                    as: 'members',
                    include: [
                        {
                            model: models_1.User,
                            as: 'user',
                            attributes: ['id', 'username', 'displayName', 'role']
                        }
                    ]
                }
            ]
        });
        res.json({
            success: true,
            data: updatedGroup,
            message: 'Group updated successfully'
        });
    }
    catch (error) {
        console.error('Update group error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update group'
        });
    }
};
exports.updateGroup = updateGroup;
//# sourceMappingURL=groupController.js.map