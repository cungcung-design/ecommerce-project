import * as conversationService from "../services/aiConversationService.js";

export async function create(req, res, next) {
  try {
    const conversation = await conversationService.createConversation(req.user.id);

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function list(req, res, next) {
  try {
    const conversations = await conversationService.getConversations(req.user.id);

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
}

export async function get(req, res, next) {
  try {
    const conversation = await conversationService.getConversation(
      req.user.id,
      req.params.id
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function rename(req, res, next) {
  try {
    const title = req.body.title;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const count = await conversationService.renameConversation(
      req.user.id,
      req.params.id,
      title.trim().slice(0, 80)
    );

    if (!count) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const count = await conversationService.deleteConversation(
      req.user.id,
      req.params.id
    );

    if (!count) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
