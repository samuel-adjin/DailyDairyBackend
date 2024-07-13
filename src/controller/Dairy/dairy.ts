import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { StatusCodes } from "http-status-codes";
import logger from "../../loggers/logger";
import notFound from "../../errors/ApiError404";
import {Diary as Constant} from "../../constants/constants"


const createDairy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, body } = req.body;
        const today = new Date;
        const currentDate = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
        const dairy = await prisma.post.create({
            data: {
                title,
                body,
                date: currentDate
            }
        })
        res.status(StatusCodes.CREATED).json({ sucess: true, data: dairy })
    } catch (error) {
        logger.error("Failed to create diary")
        next(error)
    }
}


const editDairy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, body } = req.body;
        const { id } = req.params;
        const foundDairy = await prisma.post.findUnique({
            where: {
                id
            }
        })
        if (!foundDairy) {
            throw new notFound(Constant.NOT_FOUND);
        }
        const updatedDairy = await prisma.post.update({
            where: {
                id
            },
            data: {
                title,
                body
            }
        })
        res.status(StatusCodes.OK).json({ sucess: true, data: updatedDairy })
    } catch (error) {
        logger.error("Failed to update diary")
        next(error)
    }
}

const deleteDairy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const foundDairy = await prisma.post.findUnique({
            where: {
                id
            }
        })
        if (!foundDairy) {
            throw new notFound(Constant.NOT_FOUND);
        }
        await prisma.post.delete({
            where: { id }
        })
        res.status(StatusCodes.NO_CONTENT)
    } catch (error) {
        logger.error("Failed to delete diary")
        next(error)
    }
}

const fetchPreviousDairiesPaginated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const perPage = parseInt((req.query.limit as string), 10) || 10;
        let pageNumber = parseInt((req.query.pageNumber as string), 10) || 1;
        let offset: number = Math.abs((pageNumber - 1) * perPage);
        const today = new Date();
        const currentDate = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
        const previousDiaries = await prisma.post.findMany({
            where: {
                date: {
                    lt: currentDate
                }
            },
            orderBy: {
                voteUp: "desc"
            },
            skip: offset,
            take: perPage,
        });
        const arraySize: number = await prisma.post.count({
            where: {
                date: {
                    lt: currentDate
                }
            },
        });
        let pagetracker: number = pageNumber * perPage;
        let hasNextPage: boolean = true;
        if (pagetracker > arraySize || pagetracker === arraySize) {
            hasNextPage = false
        }
        const pageInfo =
        {
            hasNextPage,
            totalDairies: arraySize,
            pageNumber: pageNumber,
            previousDiaries
        }
        res.status(StatusCodes.OK).json({ sucess: true, data: pageInfo })
    } catch (error) {
        logger.error("Failed to fetch previous diaries")
        next(error)
    }
}


const fetchTodayDairiesPaginated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const perPage = parseInt((req.query.limit as string), 10) || 10;
        let pageNumber = parseInt((req.query.pageNumber as string), 10) || 1;
        let offset: number = Math.abs((pageNumber - 1) * perPage);
        const today = new Date;
        const currentDate = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
        const diaries = await prisma.post.findMany({
            where: {
                date: currentDate
            },
            orderBy: {
                voteUp: "desc",
            },
            skip: offset,
            take: perPage,
        })

        const arraySize: number = await prisma.post.count({
            where: {
                date: currentDate
            }
        });
        let pagetracker: number = pageNumber * perPage;
        let hasNextPage: boolean = true;
        if (pagetracker > arraySize || pagetracker === arraySize) {
            hasNextPage = false
        }
        const pageInfo =
        {
            hasNextPage,
            totalDairies: arraySize,
            pageNumber: pageNumber,
            diaries
        }
        res.status(StatusCodes.OK).json({ sucess: true, data: pageInfo })
    } catch (error) {
        logger.error("Failed to fetch paginated diaries")
        next(error)
    }
}

const voteDairyUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const foundDairy = await prisma.post.findUnique({
            where: { id }
        })
        if (!foundDairy) {
            throw new notFound(Constant.NOT_FOUND);
        }
        const newVoteUp = (foundDairy?.voteUp ?? 0) + 1;
        const updateDairy = await prisma.post.update({
            where: {
                id
            },
            data: {
                voteUp: newVoteUp
            }
        })
        res.status(StatusCodes.OK).json({ sucess: true, data: updateDairy })

    } catch (error) {
        logger.error("Failed to vote up a diary")
        next(error)
    }
}

const voteDairyDown = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const foundDairy = await prisma.post.findUnique({
            where: { id }
        })
        if (!foundDairy) {
            throw new notFound(Constant.NOT_FOUND);
        }
        const newVoteDown = (foundDairy?.voteDown ?? 0) + 1;
        const updateDairy = await prisma.post.update({
            where: {
                id
            },
            data: {
                voteDown: newVoteDown
            }
        })
        res.status(StatusCodes.OK).json({ sucess: true, data: updateDairy })

    } catch (error) {
        logger.error("Failed to vote up a diary")
        next(error)
    }
}

const findDairy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const dairy = await prisma.post.findUnique({ where: { id } })
        if (!dairy) {
            throw new notFound(Constant.NOT_FOUND);
        }
        res.status(StatusCodes.OK).json({ sucess: true, data: dairy })
    } catch (error) {
        logger.error("Failed to fetch diary")
        next(error)
    }
}

const fetchTodayDairies = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const today = new Date;
        const currentDate = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
        const diaries = await prisma.post.findMany({
            where: {
                date: currentDate
            },
            orderBy: {
                voteUp: "desc",
            },

        })
        res.status(StatusCodes.OK).json({ sucess: true, data: diaries })
    } catch (error) {
        logger.error("Failed to fetch paginated diaries")
        next(error)
    }
}

const fetchPreviousDairies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const today = new Date();
        const currentDate = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
        const previousDiaries = await prisma.post.findMany({
            where: {
                date: {
                    lt: currentDate
                }
            }
        });
        res.status(StatusCodes.OK).json({ sucess: true, data: previousDiaries })
    } catch (error) {
        logger.error("Failed to fetch previous diaries")
        next(error)
    }
}

export default {
    voteDairyDown,
    voteDairyUp,
    fetchTodayDairiesPaginated,
    deleteDairy,
    editDairy,
    createDairy,
    findDairy,
    fetchTodayDairies,
    fetchPreviousDairies,
    fetchPreviousDairiesPaginated
}