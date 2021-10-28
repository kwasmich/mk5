import { UIView } from "/base/ui-view2.js";
import { Dummy } from "../dummy.js";



export class DummyA extends Dummy {}



UIView.define("dummy-a", DummyA, import.meta.url);
