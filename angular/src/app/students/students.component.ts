﻿import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { StudentServiceProxy, StudentDto, PagedResultDtoOfStudentDto } from '@shared/service-proxies/service-proxies';
import { RoleServiceProxy, RoleDto, PagedResultDtoOfRoleDto } from '@shared/service-proxies/service-proxies';

import { FilteredComponentBase, FilterCriteria, FilteredResultRequestDto, FilterType } from "shared/filtered-component-base";

import { StudentFormComponent } from "app/students/student-form/student-form.component";


@Component({
    templateUrl: './students.component.html',
    animations: [appModuleAnimation()],
    providers: [StudentServiceProxy]
})
export class StudentsComponent extends FilteredComponentBase<StudentDto> {

    @ViewChild('studentFormModal') studentFormModal: StudentFormComponent;

    active: boolean = false;
    items: StudentDto[] = [];
    nameSearch: string;
    ageSearch: number;
    roleId: number = -1;
    roles: RoleDto[] = null;
    deletedItem: boolean = false;
	constructor(
        injector: Injector,
        private _studentService: StudentServiceProxy, private _roleService: RoleServiceProxy

    ) {

        super(injector);
    }

    ngOnInit() {
        this._roleService.getAll(0, 1000).subscribe((data: PagedResultDtoOfRoleDto) => {
            this.roles = data.items;
        });
        super.ngOnInit();
    }

    protected list(request: FilteredResultRequestDto, pageNumber: number, finishedCallback: Function): void {
        if(!this.deletedItem){
        this._studentService.getAll(request.search,request.sorting, request.skipCount, request.maxResultCount)
            .finally(() => {
                finishedCallback();
            })
            .subscribe((result: PagedResultDtoOfStudentDto) => {
                this.items = result.items;
                this.showPaging(result, pageNumber);
                });
        }
        else {
            this._studentService.getAllDeleted(request.search,request.sorting, request.skipCount, request.maxResultCount)
                .finally(() => {
                    finishedCallback();
                })
                .subscribe((result: PagedResultDtoOfStudentDto) => {
                    this.items = result.items;
                    this.showPaging(result, pageNumber);
                });
        }
    }

    protected delete(item: StudentDto): void {
        abp.message.confirm(
            "Delete Student '" + item.id + "'?",
            (result: boolean) => {
                if (result) {
                    this._studentService.delete(item.id)
                        .finally(() => {
                            abp.notify.info("Deleted Student: " + item.id);
                            this.refresh();
                        })
                        .subscribe(() => { });
                }
            }
        );
    }

    // Show Modals
    create(): void {
        this.studentFormModal.show();
    }

    search() {
        let items = new Array<FilterCriteria>();
        if (this.nameSearch !== undefined && this.nameSearch !== null && this.nameSearch.trim() !== '')
            items.push({ FilterName: "Name", FilterType: FilterType.like, FilterValue: this.nameSearch });

        if (this.ageSearch !== undefined && this.ageSearch !== null)
            items.push({ FilterName: "Age", FilterType: FilterType.eq, FilterValue: this.ageSearch });

        if (this.roleId !== undefined && this.roleId !== null && this.roleId!=-1)
            items.push({ FilterName: "RoleId", FilterType: FilterType.eq, FilterValue: parseInt(this.roleId.toString()) });

        this.Filter(items);
    }

    edit(item: StudentDto): void {
        this.studentFormModal.show(item.id);
    }
    getDeleted() {
        this.refresh();
    }

    restore(id: number) {
        this._studentService.restore(id).finally(() => {
            abp.notify.info("Student Restored");
            this.refresh();
        }).subscribe(() => {
            this.refresh();
        })
    }

}