import { container } from "tsyringe";
import { IDateProvider } from "./dto";
import { DaysjsProvider } from "./implementations/dayjsProvider";

container.registerSingleton<IDateProvider>("DaysjsProvider", DaysjsProvider);
