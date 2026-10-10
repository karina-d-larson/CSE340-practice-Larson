import { Router } from 'express';
import { aboutPage, demoPage, homePage, testErrorPage } from './index.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { facultyDetailPage, facultyListPage } from './faculty/faculty.js';
import { addDemoHeaders } from '../middleware/demo/headers.js';

const router = Router();

router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultyId', facultyDetailPage);
router.get('/demo', addDemoHeaders, demoPage);
router.get('/test-error', testErrorPage);

export default router;
