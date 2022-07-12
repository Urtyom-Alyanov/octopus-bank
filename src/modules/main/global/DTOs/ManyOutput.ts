export class ManyOutput<OutputType extends {}> {
    items: OutputType[];
    count: number;
    limit: number;
    page: number;
}