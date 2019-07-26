import { RequestHandler } from 'express';

export const search: RequestHandler = async (req, res) => {
  const { room, q, offset, limit } = req.query;
};
