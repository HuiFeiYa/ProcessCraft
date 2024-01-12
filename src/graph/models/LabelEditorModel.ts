import { Bounds, Shape } from "../types";
import { StyleObject } from "../types/shapeOption";
import { GraphModel } from "./graphModel";

export class LabelEditorModel {
    style: StyleObject = {};
    editingShape: Shape | undefined = undefined;
    originText = ''
    text = "";
    labelType = '';
    shapeKey = '';
    showPreview = false;
    bounds!: Bounds;

    constructor(public graph: GraphModel) { }

    setText(text: string) {
        this.text = text
    }
    initPreviewState() {
        this.style = {};
        this.editingShape = undefined;
        this.text = "";
        this.bounds = undefined;
        this.showPreview = false;
        this.originText = '';
    }
    async endEdit() {
        if (!this.editingShape) {
            this.initPreviewState()
        }
        // 文案未编辑
        if (this.originText === this.text) {
            this.initPreviewState();
            return;
        }
        try {
            await this.graph.graphOption.saveText(this.editingShape, this.text)
        } catch (error) {
            console.error(error.message)
        }
        this.initPreviewState()
    }

    onShapeNameLabelClick(event: MouseEvent, shape: Shape, labelType: string) {
        this.labelType = labelType;
        const selection = this.graph.selectionModel.selection;
        // 选中图形和编辑 label 图形是否为同一个
        if (selection.length === 1 && selection[0].id === shape.id) {
            this.setShapeInEdit(shape);
        }
    }
    setShapeInEdit(shape: Shape) {
        this.editingShape = shape;
        this.text = this.graph.graphOption.getEditingText?.(shape)
        this.originText = this.text;
        this.style = { ...shape.nameStyle, background: shape.style.background };
        this.shapeKey = shape.shapeKey;
        if (shape.style.imageBox) {
            this.style = shape.nameStyle;
        }
        this.bounds = shape.bounds;
        this.showPreview = true;
    }

}