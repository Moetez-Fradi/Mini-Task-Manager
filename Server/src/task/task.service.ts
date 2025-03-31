import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { ALLOWED_PRIORITIES, ALLOWED_STATUSES } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService, private userService: UserService) {}


async partialUpdate(id: string, newStatus: any) {
  const currentTask = await this.findOne(id);
  console.log(newStatus)
  return this.prisma.task.update({
    where: { id },
    data: {
      title: currentTask.title,
      description: currentTask.description,
      priority: currentTask.priority,
      status: newStatus.status,  
      userId: currentTask.userId
    },
    include: {
      user: true 
    }
  });
}

  async create(createTaskDto: CreateTaskDto) {
    try {
      if (!createTaskDto.userEmail) {
        throw new BadRequestException('user email is required');
      }

      const user = await this.prisma.user.findUnique({
        where: { email: createTaskDto.userEmail },
        select: { id: true }
      });

      if (!user) {
        throw new NotFoundException(`User with email ${createTaskDto.userEmail} not found`);
      }

      return await this.prisma.task.create({
        data: {
          title: createTaskDto.title || "New Task",
          description: createTaskDto.description || "",
          status: createTaskDto.status || "TODO",
          priority: createTaskDto.priority || "MEDIUM",
          user: {
            connect: { id: user.id }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return this.prisma.task.findMany({
      select :{
        title : true,
        description : true,
        status : true,
        priority : true,
        userId : true,
        id: true,
        user: true,
      }
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select : {
        id : true,
        user : true,
        title : true,
        description : true,
        priority : true, 
        userId : true
      }
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async findByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.task.findMany({
      where: {
        userId
      },
      select : {
        id : true,
        user : true,
        title : true
      }
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const existingTask = await this.prisma.task.findUnique({
        where: { id }
      });
  
      if (!existingTask) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
  
      const updateData: Prisma.TaskUpdateInput = {};
  
      if (updateTaskDto.title !== null) {
        updateData.title = updateTaskDto.title === '' ? existingTask.title : updateTaskDto.title;
      }
  
      if (updateTaskDto.description !== undefined) {
        updateData.description = updateTaskDto.description === '' ? null : updateTaskDto.description;
      }
  
      if (updateTaskDto.priority !== undefined) {
          updateData.priority = updateTaskDto.priority as typeof ALLOWED_PRIORITIES[number];
        }
  
        if (updateTaskDto.userEmail !== undefined && updateTaskDto.userEmail !== '') {
          const user = await this.prisma.user.findUnique({
            where: { email: updateTaskDto.userEmail }
          });
          
          if (!user) {
            throw new NotFoundException(`User with email ${updateTaskDto.userEmail} not found`);
          }
          
          updateData.user = { connect: { id: user.id } };
        }
  
        return await this.prisma.task.update({
          where: { id },
          data: updateData,
          select : {
            id : true,
            user : true,
            title : true,
            description : true
          }
        });
  
    } catch (error) {
      throw error;
    }
  }


  async remove(id: string) {
    try {
      return await this.prisma.task.delete({
        where: { id },
        select : {
          id : true,
          user : true,
          title : true
        }
      });
    } catch (error) {
      throw error;
    }
  }
}