import App from './components/containers/App';
import DashboardPage from './components/containers/DashboardPage';
import ExperimentAddEdit from './components/containers/ExperimentAddEdit';
import Experiment from './components/containers/Experiment';


export default {
    path: '/',
    component: App,
    indexRoute: {
        component: DashboardPage
    },
    childRoutes: [
        {
            path: 'dashboard',
            component: DashboardPage
        },
        {
            path: 'experiments/add',
            component: ExperimentAddEdit
        },
        {
            path: 'experiments/:expId',
            component: Experiment
        },
        {
            path: 'experiments/:expId/edit',
            component: ExperimentAddEdit
        },
        {
            path: '*',
            onEnter: (nextState, replace) => replace('/dashboard')
        }
    ]
};
