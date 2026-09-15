import test from 'node:test';
import assert from 'node:assert/strict';
import { formatUser } from './controllers/auth.controller.js';
import { formatPublicUser } from './controllers/user.controller.js';
import { formatTask } from './models/task.model.js';

test('formatUser correctly formats user DTO with alias fields', () => {
    const rawUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        full_name: 'Adewale Johnson',
        email: 'adewale@student.oauife.edu.ng',
        matric_number: 'CSC/2021/045',
        phone: '08012345678',
        is_verified: true,
        avatar_url: 'https://example.com/avatar.png',
        created_at: new Date('2026-01-01T00:00:00Z')
    };

    const userDto = formatUser(rawUser);

    assert.equal(userDto.id, rawUser.id);
    assert.equal(userDto.fullName, rawUser.full_name);
    assert.equal(userDto.email, rawUser.email);
    assert.equal(userDto.schoolEmail, rawUser.email);
    assert.equal(userDto.matricNumber, rawUser.matric_number);
    assert.equal(userDto.phone, rawUser.phone);
    assert.equal(userDto.isVerified, true);
    assert.equal(userDto.avatarUrl, rawUser.avatar_url);
});

test('formatPublicUser strictly omits phone contact information', () => {
    const rawUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        full_name: 'Adewale Johnson',
        email: 'adewale@student.oauife.edu.ng',
        matric_number: 'CSC/2021/045',
        phone: '08012345678',
        is_verified: true,
        avatar_url: null,
        created_at: new Date('2026-01-01T00:00:00Z')
    };

    const publicUser = formatPublicUser(rawUser);

    assert.equal(publicUser.id, rawUser.id);
    assert.equal(publicUser.fullName, rawUser.full_name);
    assert.equal(publicUser.matricNumber, rawUser.matric_number);
    assert.equal((publicUser as any).phone, undefined);
    assert.equal((publicUser as any).email, undefined);
});

test('formatTask formats numbers and handles null runners safely', () => {
    const rawTask = {
        id: '987e6543-e21b-12d3-a456-426614174000',
        title: 'Pick up laundry',
        description: 'From Angola Hall',
        proof_requirement: 'Photo of clothes in bag',
        location: 'Angola Hall',
        fee: '1500.00',
        status: 'open',
        poster_id: '123e4567-e89b-12d3-a456-426614174000',
        runner_id: null,
        proof_image_url: null,
        deadline_at: null,
        created_at: new Date('2026-01-01T00:00:00Z'),
        updated_at: new Date('2026-01-01T00:00:00Z'),
        poster_name: 'Poster Name',
        poster_avatar: null
    };

    const taskDto = formatTask(rawTask);

    assert.equal(taskDto.id, rawTask.id);
    assert.equal(taskDto.taskPrice, 1500);
    assert.equal(taskDto.totalPrice, 1500);
    assert.equal(taskDto.status, 'open');
    assert.equal(taskDto.poster.fullName, 'Poster Name');
    assert.equal(taskDto.doer, null);
});
