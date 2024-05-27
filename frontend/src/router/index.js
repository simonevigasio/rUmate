import { createRouter, createWebHistory } from 'vue-router';

// Import components
import RegistrationForm from '../components/RegistrationForm.vue'
import LoginForm from '../components/LoginForm.vue'
import VisualizationAd from '../components/VisualizationAd.vue'          //  _test da togliere
import AdSelection from '../components/AdSelection.vue'
import PubblicationAd from '../components/PubblicationAd.vue'
import VisualizationChat from '../components/VisualizationChat.vue'

const routes = [
  { path: '/', component: VisualizationAd },
  { path: '/advertisement', component: AdSelection },
  { path: '/signin', component: RegistrationForm},
  { path: '/login', component: LoginForm },
  { path: '/publishAd', component: PubblicationAd },
  { path: '/chat', component: VisualizationChat },
];

export default createRouter({ history: createWebHistory(), routes })
