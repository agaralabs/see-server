import App from './components/containers/App';
import DashboardPage from './components/containers/DashboardPage';
import ExperimentCreate from './components/containers/ExperimentCreate';
import Experiment from './components/containers/Experiment';
import ExperimentPage from './components/containers/ExperimentPage';

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
            path: 'experiments/create',
            component: ExperimentCreate
        },
        {
            path: 'experiments/:expId',
            component: Experiment,
            indexRoute: {
                component: ExperimentPage
            },
            childRoutes: [
                {
                    path: 'variations/:varId'
                }
            ]
        },
        {
            path: '*',
            onEnter: (nextState, replace) => replace('/')
        }
    ]
};
