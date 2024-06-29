/* eslint-disable no-unused-vars */
"use server";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateQuestionParams,
  DeleteUserParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  UpdateUserParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";


export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    // Calculcate the number of posts to skip based on the page number and page size
    
    
    const questions = await Question.find()
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })

    
    return questions;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();
    const { title, content, tags, author, path } = params;
    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocuments = [];
    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });
    // Create an interaction record for the user's ask_question action
    
    // Increment author's reputation by +5 for creating a question
    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });
    return question;
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
    //   await Answer.deleteMany({ author: user._id });
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
    //   await Interaction.deleteMany({ user: user._id });
      // Finally, delete the user
      const deletedUser = await User.findByIdAndDelete(user._id);
      return deletedUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }



