import { UIView } from "/base/ui-view.js";
import { Dummy } from "../dummy.js";



export class DummyB extends Dummy {}



UIView.define("dummy-b", DummyB, import.meta.url);
