import { Router } from 'express';
import RequestValidator from '../../middleware/requestValidatorMiddleware'
import dairy from '../../controller/Dairy/dairy'
import { DairySchema } from '../../schema/DairySchema'
const router = Router();

router.route("/").post(RequestValidator(DairySchema), dairy.createDairy).get(dairy.fetchTodayDairiesPaginated)
router.route("/previous-diaries").get(dairy.fetchPreviousDairies)
router.route("/previous-diaries-paginate").get(dairy.fetchPreviousDairiesPaginated)
router.route("/today-diaries").get(dairy.fetchTodayDairies)

router.route("/:id").get(dairy.findDairy).delete(dairy.deleteDairy).patch(RequestValidator(DairySchema), dairy.editDairy)
router.route("/vote-down/:id").get(dairy.voteDairyDown)
router.route("/vote-up/:id").get(dairy.voteDairyUp)


export default router;