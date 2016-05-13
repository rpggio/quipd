
import 'collections/parties';

import {loadParties} from './load_parties';
 
Meteor.startup(loadParties);
