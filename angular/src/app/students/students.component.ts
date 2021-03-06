﻿import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { StudentServiceProxy, StudentDto, PagedResultDtoOfStudentDto } from '@shared/service-proxies/service-proxies';
import { RoleDto, PagedResultDtoOfRoleDto } from '@shared/service-proxies/service-proxies';

import { FilteredComponentBase, FilterCriteria, FilteredResultRequestDto, FilterType } from "shared/filtered-component-base";

import { StudentFormComponent } from "app/students/student-form/student-form.component";


@Component({
    templateUrl: './students.component.html',
    animations: [appModuleAnimation()],
    providers: [StudentServiceProxy]
})
export class StudentsComponent extends FilteredComponentBase<StudentDto> {

    @ViewChild('studentFormModal') studentFormModal: StudentFormComponent;

    items: StudentDto[] = [];
parentIdList: StudentDto[] = null;
    nameFilter: string;
    ageFilter: number;
    roleIdFilter: number = -1;
    parentIdFilter: number = -1;
    roleIdList: RoleDto[] = null;
    showDeleted: boolean = false;
    breadcrumbs: StudentDto[] = [];

	constructor(
        injector: Injector,
        private _studentService: StudentServiceProxy//, private _roleService: RoleServiceProxy

    ) {

        super(injector);
    }


    ngOnInit() {
        this.parentIdFilter = null;
        this.search();
        //this._roleService.getAll().subscribe((data: PagedResultDtoOfRoleDto) => {
        //    this.roleIdList = data.items;
        //});

        super.ngOnInit();
    }

    protected list(request: FilteredResultRequestDto, pageNumber: number, finishedCallback: Function): void {
        if(!this.showDeleted){
            this._studentService.getAll(request.search, request.maxResultCount,request.sorting, request.skipCount)
            .finally(() => {
                finishedCallback();
            })
            .subscribe((result: PagedResultDtoOfStudentDto) => {
                this.items = result.items;
                this.showPaging(result, pageNumber);
                });
        }
        else {
            this._studentService.getAllDeleted(request.search, request.maxResultCount, request.sorting, request.skipCount)
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
        if (this.nameFilter !== undefined && this.nameFilter !== null && this.nameFilter.trim() !== '')
            items.push({ FilterName: "Name", FilterType: FilterType.like, FilterValue: this.nameFilter });

        if (this.ageFilter !== undefined && this.ageFilter !== null)
            items.push({ FilterName: "Age", FilterType: FilterType.eq, FilterValue: this.ageFilter });

        if (this.roleIdFilter !== undefined && this.roleIdFilter !== null && this.roleIdFilter!=-1)
            items.push({ FilterName: "RoleId", FilterType: FilterType.eq, FilterValue: parseInt(this.roleIdFilter.toString()) });

        if (this.parentIdFilter !== undefined && this.parentIdFilter != -1) {
            let value: number = this.parentIdFilter == null ? this.parentIdFilter : parseInt(this.parentIdFilter.toString());
            items.push({ FilterName: "ParentId", FilterType: FilterType.eq, FilterValue: value });
        }
        

        this.Filter(items);
    }
    getStudentByParent(student: StudentDto) {
        this.parentIdFilter = student.id;
        this.breadcrumbs.push(student);
        this.search();
    }
    setbreadcrumbs(student: StudentDto) {
        if (student == null) {
            this.parentIdFilter = null;
            this.breadcrumbs = [];
        }
        else {
            this.parentIdFilter = student.id;
            let index: number = this.breadcrumbs.indexOf(student) + 1;
            this.breadcrumbs.splice(index, this.breadcrumbs.length);
        }
        this.search();
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