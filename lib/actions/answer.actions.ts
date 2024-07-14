/* eslint-disable no-unused-vars */
"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
    AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;
    const newAnswer = await Answer.create({ content, author, question });
    // Add the answer to the question's answers array
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
    try {
      connectToDatabase();
      const { questionId, sortBy, page = 1, pageSize = 10 } = params;

      const answers = await Answer.find({ question: questionId })
        .populate("author", "_id clerkId name picture")
        .sort({createdAt:-1});

      return { answers };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
      connectToDatabase();
      const { answerId, userId, hasAlreadyUpvoted, hasAlreadyDownvoted, path } =
        params;
      let updateQuery = {};
      if (hasAlreadyUpvoted) {
        updateQuery = { $pull: { upvotes: userId } };
      } else if (hasAlreadyDownvoted) {
        updateQuery = {
          $pull: { downvotes: userId },
          $push: { upvotes: userId },
        };
      } else {
        updateQuery = { $addToSet: { upvotes: userId } };
      }
      const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
        new: true,
      });
      if (!answer) {
        throw new Error("Answer not found");
      }
    
      
      revalidatePath(path);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
      connectToDatabase();
      const { answerId, userId, hasAlreadyUpvoted, hasAlreadyDownvoted, path } =
        params;
      let updateQuery = {};
      if (hasAlreadyDownvoted) {
        updateQuery = { $pull: { downvotes: userId } };
      } else if (hasAlreadyUpvoted) {
        updateQuery = {
          $pull: { upvotes: userId },
          $push: { downvotes: userId },
        };
      } else {
        updateQuery = { $addToSet: { downvotes: userId } };
      }
      const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
        new: true,
      });
      if (!answer) {
        throw new Error("Answer not found");
      }
    
      revalidatePath(path);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  export async function deleteAnswer(params: DeleteAnswerParams) {
    try {
      connectToDatabase();
      const { answerId, path } = params;
      const answer = await Answer.findById(answerId);
      if (!answer) {
        throw new Error("Answer not found");
      }
      await answer.deleteOne({ _id: answerId });
      await Question.updateMany(
        { _id: answer.question },
        { $pull: { answers: answerId } }
      );
      revalidatePath(path);
    } catch (error) {
      console.error(error);
    }
  }
  