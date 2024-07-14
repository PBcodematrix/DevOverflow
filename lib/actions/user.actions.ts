/* eslint-disable no-unused-vars */
"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import { revalidatePath } from "next/cache";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";

export async function getUserById(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    // Delete user's questions
    await Question.deleteMany({ author: user._id });
    // Delete user's answers
    await Answer.deleteMany({ author: user._id });
    // // Remove user from upvotes of questions
    // await Question.updateMany(
    //   { upvotes: { $in: [user._id] } },
    //   { $pull: { upvotes: user._id } }
    // );
    // // Remove user from downvotes of questions
    // await Question.updateMany(
    //   { downvotes: { $in: [user._id] } },
    //   { $pull: { downvotes: user._id } }
    // );
    // // Remove user from upvotes of answers
    // await Answer.updateMany(
    //   { upvotes: { $in: [user._id] } },
    //   { $pull: { upvotes: user._id } }
    // );
    // // Remove user from downvotes of answers
    // await Answer.updateMany(
    //   { downvotes: { $in: [user._id] } },
    //   { $pull: { downvotes: user._id } }
    // );
    // Delete interactions related to the user
    // Finally, delete the user
    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    // const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    
    
    const users = await User.find({})
   
    return { users };
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params;
    
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }
    
    const savedQuestions = user.saved;
    return { questions: savedQuestions};
  } catch (error) {
    console.error(error);
    throw error;
  }
}